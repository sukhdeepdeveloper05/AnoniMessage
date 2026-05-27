import { cn } from "@/lib/utils";
import { Image as ImageKit } from "@imagekit/next";
import Image from "next/image";
import React, { useRef, useState } from "react";

interface DropZoneProps {
  avatar?: {
    fileId: string;
    filePath: string;
    updatedAt: Date;
  } | null;
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
}

const DropZone = ({ avatar, selectedFile, onFileChange }: DropZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (
    e: React.DragEvent<HTMLDivElement>,
    draggingState: boolean,
  ) => {
    e.preventDefault();
    setIsDragging(draggingState);
  };

  const imageProps = {
    alt: "uploadImage",
    width: 300,
    height: 300,
    className: "rounded-full object-cover size-full",
  };

  return (
    <div
      className={cn(
        "relative w-62 h-62 rounded-full overflow-hidden cursor-pointer",
      )}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onDragOver={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
          onFileChange(file);
        }
      }}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-full transition-all font-mono flex items-center justify-center opacity-0 pointer-events-none",
          isDragging && "bg-muted-foreground/40 opacity-100",
        )}
      >
        Drop to upload
      </div>

      {selectedFile ? (
        <Image src={URL.createObjectURL(selectedFile)} {...imageProps} />
      ) : avatar ? (
        <ImageKit
          urlEndpoint="https://ik.imagekit.io/anonimessage"
          src={
            avatar?.filePath
              ? `${avatar.filePath}?v=${avatar.updatedAt || ""}`
              : ""
          }
          loading="eager"
          {...imageProps}
        />
      ) : (
        <div className="bg-muted-foreground/40 rounded-full size-full flex items-center justify-center">
          <span className="text-muted-foreground/80 text-sm font-medium">
            No Image
          </span>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        hidden
        ref={inputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFileChange(file);
          }
        }}
      />
    </div>
  );
};

export default DropZone;
