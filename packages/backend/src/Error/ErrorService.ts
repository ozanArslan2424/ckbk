import { C } from "@ozanarslan/corpus";
import { Prisma } from "prisma/generated/client";

import type { LocaleService } from "@/Locale/LocaleService";
import { Logger } from "@/Logger/Logger";

export class ErrorService {
	private readonly logger = new Logger(this.constructor.name);
	constructor(private readonly localeService: LocaleService) {}

	onError(locale: string, err: Error): C.Res {
		const { status, key } = this.getStatusAndKey(err);
		const message = this.localeService.translate(locale, "error", key);
		if (status !== C.Status.UNAUTHORIZED) {
			this.logger.error(err.message);
		}
		return new C.Res({ message }, { status });
	}

	private getStatusAndKey(err: Error) {
		let status: C.Status = C.Status.INTERNAL_SERVER_ERROR;
		let key: string = err.message;

		if (err instanceof Prisma.PrismaClientKnownRequestError) {
			key = `prisma.${err.code}`;
			status = this.prismaStatus[err.code] ?? C.Status.BAD_REQUEST;
		} else if (err instanceof Prisma.PrismaClientInitializationError) {
			key = "prisma.connection";
		} else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
			key = "prisma.unknown";
		} else if (err instanceof Prisma.PrismaClientValidationError) {
			key = "prisma.validation";
			status = C.Status.BAD_REQUEST;
		} else if (err instanceof Prisma.PrismaClientRustPanicError) {
			key = "prisma.rustPanic";
		} else if (err instanceof C.Exception) {
			key = err.message;
			status = err.status;
		}

		return { status, key };
	}

	private readonly prismaStatus: Record<string, C.Status> = {
		P2000: C.Status.BAD_REQUEST,
		P2001: C.Status.NOT_FOUND,
		P2002: C.Status.CONFLICT,
		P2003: C.Status.BAD_REQUEST,
		P2004: C.Status.BAD_REQUEST,
		P2005: C.Status.BAD_REQUEST,
		P2006: C.Status.BAD_REQUEST,
		P2007: C.Status.BAD_REQUEST,
		P2014: C.Status.BAD_REQUEST,
		P2025: C.Status.NOT_FOUND,
	};
}
