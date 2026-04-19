import { ImagePlusIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { useCommonLocale } from "@/Locale/useCommonLocale";

type ImageUploadProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "value"> & {
	image?: string | File | null;
	onImageAdd?: (file: File) => void;
	onImageRemove?: () => void;
	onImageChange?: (file: File | null) => void;
};

export function ImageUpload({
	image,
	onImageAdd,
	onImageRemove,
	onImageChange,
	...inputProps
}: ImageUploadProps) {
	const { txt } = useCommonLocale();
	const [internalFile, setInternalFile] = useState<File | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	const file = image !== undefined ? image : internalFile;

	const preview = useMemo(
		() => (file ? (typeof file === "string" ? file : URL.createObjectURL(file)) : null),
		[file],
	);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const f = e.target.files?.[0];
		if (f) {
			if (image === undefined) setInternalFile(f);
			onImageAdd?.(f);
			onImageChange?.(f);
		}
	}

	function handleRemove() {
		if (image === undefined) setInternalFile(null);
		if (inputRef.current) inputRef.current.value = "";
		onImageRemove?.();
		onImageChange?.(null);
	}

	return (
		<div className="group relative min-h-20 w-full">
			<input
				ref={inputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={handleChange}
				{...inputProps}
			/>
			{preview && (
				<img
					src={preview}
					alt="Preview"
					className="absolute inset-0 h-full w-full rounded-lg object-cover"
				/>
			)}
			{preview ? (
				<button
					type="button"
					onClick={handleRemove}
					className="square sm ghost bg-background/70 hover:bg-background absolute top-2 right-2 opacity-50 transition-opacity group-hover:opacity-100"
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M18 6L6 18M6 6l12 12" />
					</svg>
				</button>
			) : (
				<button
					type="button"
					onClick={() => inputRef.current?.click()}
					className="input-like flex h-full w-full flex-col items-center justify-center gap-2 border-dashed"
				>
					<ImagePlusIcon />
					<span className="text-sm font-semibold">{txt.upload}</span>
				</button>
			)}
		</div>
	);
}
