import path from "node:path";

import { X } from "@ozanarslan/corpus";
import nodemailer from "nodemailer";

import type { LocaleService } from "@/Locale/LocaleService";
import type { Translator, TranslatorCollectionKey } from "@/Locale/LocaleTypes";
import { Logger } from "@/Logger/Logger";

export class MailService {
	private readonly logger = new Logger(this.constructor.name);
	private readonly transporter: nodemailer.Transporter;

	constructor(private readonly localeService: LocaleService) {
		this.transporter = this.createTransporter();
	}

	async loadTemplate(filename: string, variables: Record<string, string> = {}) {
		const file = new X.File(path.resolve(process.cwd(), "public", "mail", filename));
		return this.replaceVariables(await file.text(), variables);
	}

	private replaceVariables(template: string, variables: Record<string, string> = {}) {
		for (const [varKey, varVal] of Object.entries(variables)) {
			template = template.replace(new RegExp(`{{${varKey}}}`, "g"), varVal);
		}
		return template;
	}

	private createTransporter() {
		return nodemailer.createTransport({
			host: X.Config.get("SMTP_HOST"),
			port: X.Config.get("SMTP_PORT", {
				parser: parseInt,
				fallback: 587,
			}),
			secure: false,
			auth: {
				user: X.Config.get("SMTP_USER"),
				pass: X.Config.get("SMTP_PASS"),
			},
			tls: {
				rejectUnauthorized: false,
			},
		});
	}

	private async verify(): Promise<boolean> {
		try {
			await this.transporter.verify();
			return true;
		} catch (error) {
			this.logger.error("Transporter not verified", {
				user: X.Config.get("SMTP_USER"),
				error,
			});
			return false;
		}
	}

	private async send({
		toEmail,
		toName,
		subject,
		text,
		html,
	}: {
		toEmail: string;
		toName: string;
		subject: string;
		text: string;
		html?: string;
	}): Promise<unknown> {
		return this.transporter.sendMail({
			from: `"${X.Config.get("APP_NAME")}" <${X.Config.get("SMTP_USER")}>`,
			to: `"${toName || ""}" <${toEmail}>`,
			subject,
			text,
			html,
		});
	}

	async sendMail({
		toName,
		toEmail,
		subject,
		htmlTemplateName,
		textTemplateName,
		translator,
		variables,
	}: {
		toEmail: string;
		toName: string;
		translator: TranslatorCollectionKey;
		htmlTemplateName?: string;
		textTemplateName: string;
		subject: (t: Translator) => string;
		variables: (t: Translator) => Record<string, string>;
	}) {
		const verified = await this.verify();
		if (!verified) return;
		const t = this.localeService.makeTranslator(translator);

		const info = await this.send({
			toEmail,
			toName,
			subject: subject(t),
			text: await this.loadTemplate(textTemplateName, variables(t)),
			html: htmlTemplateName ? await this.loadTemplate(htmlTemplateName, variables(t)) : "",
		});

		this.logger.log("Message Sent", info);
	}

	async sendTextMail({
		toEmail,
		toName,
		subject,
		text,
	}: {
		toEmail: string;
		toName: string;
		subject: string;
		text: string;
	}) {
		const verified = await this.verify();
		if (!verified) return;

		const info = await this.send({
			toName,
			toEmail,
			subject,
			text,
		});

		this.logger.log("Message Sent", info);
	}
}
