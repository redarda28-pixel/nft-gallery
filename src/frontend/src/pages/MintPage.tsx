import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMintNFT } from "@/hooks/useNFTs";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ImagePlus, Sparkles, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function MintPage() {
  const { isAuthenticated, isInitializing, login } = useInternetIdentity();
  const navigate = useNavigate();
  const mintNFT = useMintNFT();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [titleError, setTitleError] = useState("");
  const [imageError, setImageError] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulate upload progress while minting
  useEffect(() => {
    if (mintNFT.isPending) {
      setUploadProgress(0);
      progressRef.current = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 85) {
            if (progressRef.current) clearInterval(progressRef.current);
            return 85;
          }
          return prev + Math.random() * 12;
        });
      }, 300);
    } else if (mintNFT.isSuccess) {
      setUploadProgress(100);
      if (progressRef.current) clearInterval(progressRef.current);
    } else {
      setUploadProgress(0);
      if (progressRef.current) clearInterval(progressRef.current);
    }
    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [mintNFT.isPending, mintNFT.isSuccess]);

  // Auth guard — redirect to login
  if (!isInitializing && !isAuthenticated) {
    return (
      <div
        className="flex flex-col items-center justify-center py-32 text-center gap-6"
        data-ocid="mint.auth_required"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
            <Sparkles className="h-9 w-9 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground">
              Login to Mint
            </h2>
            <p className="text-muted-foreground max-w-xs text-sm">
              Connect your Internet Identity to create and own digital artwork
              on-chain.
            </p>
          </div>
          <Button
            onClick={() => login()}
            size="lg"
            className="font-mono text-xs uppercase tracking-widest px-8"
            data-ocid="mint.login_button"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Connect Identity
          </Button>
        </motion.div>
      </div>
    );
  }

  const applyImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setImageError("Only image files are supported");
      return;
    }
    setImageError("");
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) applyImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyImageFile(file);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (val.length > 100) {
      setTitleError("Title must be 100 characters or less");
    } else if (val.trim()) {
      setTitleError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    if (!imageFile) {
      setImageError("Please select an image");
      valid = false;
    }
    if (!title.trim()) {
      setTitleError("Title is required");
      valid = false;
    } else if (title.length > 100) {
      setTitleError("Title must be 100 characters or less");
      valid = false;
    }
    if (!valid) return;

    try {
      await mintNFT.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        imageFile: imageFile!,
      });
      toast.success("NFT minted successfully! 🎨");
      navigate({ to: "/my-nfts" });
    } catch (_err) {
      toast.error("Failed to mint NFT. Please try again.");
    }
  };

  const canSubmit =
    !mintNFT.isPending &&
    !!imageFile &&
    !!title.trim() &&
    title.length <= 100 &&
    description.length <= 500;

  return (
    <div className="max-w-2xl mx-auto" data-ocid="mint.page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Page header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold uppercase tracking-tight text-foreground">
              Mint NFT
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Create a new digital artwork on-chain
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0 mt-1">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Artwork Image <span className="text-destructive">*</span>
            </Label>
            <label
              className={`relative border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-all duration-200 block ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : imageError
                    ? "border-destructive bg-destructive/5"
                    : imageFile
                      ? "border-primary/50"
                      : "border-border hover:border-primary/60 hover:bg-muted/30"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              data-ocid="mint.dropzone"
            >
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-72 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span className="text-xs font-mono text-foreground/80">
                      {imageFile?.name}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="text-xs font-mono bg-card/80 backdrop-blur-sm border border-border px-2 py-1 rounded text-muted-foreground">
                      Click to change
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3 px-6">
                  <div className="w-14 h-14 rounded-xl bg-muted/50 border border-border flex items-center justify-center">
                    <ImagePlus className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground/70">
                      {isDragOver
                        ? "Drop image here"
                        : "Click or drag to upload"}
                    </p>
                    <p className="text-xs mt-1">
                      JPG, PNG, GIF, WEBP · Max 10MB
                    </p>
                  </div>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="sr-only"
                data-ocid="mint.upload_button"
              />
            </label>
            {imageError && (
              <p
                className="text-xs text-destructive font-mono"
                data-ocid="mint.image_field_error"
              >
                {imageError}
              </p>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="mint-title"
                className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
              >
                Title <span className="text-destructive">*</span>
              </Label>
              <span
                className={`text-xs font-mono ${
                  title.length > 100
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {title.length}/100
              </span>
            </div>
            <Input
              id="mint-title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              onBlur={() => {
                if (!title.trim()) setTitleError("Title is required");
              }}
              placeholder="Give your artwork a name"
              maxLength={120}
              className={
                titleError
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
              data-ocid="mint.input"
            />
            {titleError && (
              <p
                className="text-xs text-destructive font-mono"
                data-ocid="mint.title_field_error"
              >
                {titleError}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="mint-description"
                className="font-mono text-xs uppercase tracking-wider text-muted-foreground"
              >
                Description{" "}
                <span className="text-muted-foreground/50">(optional)</span>
              </Label>
              <span
                className={`text-xs font-mono ${
                  description.length > 500
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {description.length}/500
              </span>
            </div>
            <Textarea
              id="mint-description"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              placeholder="Describe your artwork, its inspiration, or story..."
              rows={4}
              data-ocid="mint.textarea"
            />
          </div>

          {/* Upload progress bar */}
          {mintNFT.isPending && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-2 rounded-lg bg-muted/30 border border-border p-4"
              data-ocid="mint.loading_state"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  Minting on-chain...
                </span>
                <span className="text-xs font-mono text-primary">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <motion.div
                  className="bg-primary h-1.5 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          )}

          {/* Error state */}
          {mintNFT.isError && (
            <div
              className="rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive font-mono"
              data-ocid="mint.error_state"
            >
              Minting failed. Please try again.
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full font-mono text-xs uppercase tracking-widest h-12"
            data-ocid="mint.submit_button"
          >
            {mintNFT.isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                Minting NFT...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Mint NFT
              </span>
            )}
          </Button>

          {!canSubmit && !mintNFT.isPending && (
            <p className="text-center text-xs text-muted-foreground font-mono">
              {!imageFile
                ? "Upload an image to continue"
                : !title.trim()
                  ? "Add a title to continue"
                  : ""}
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
}
