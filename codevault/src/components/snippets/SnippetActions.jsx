import { Copy, Pencil, Star, Trash2 } from "lucide-react";
import IconButton from "../ui/IconButton";

export default function SnippetActions({
  copied,
  isFavorite,
  onCopy,
  onDelete,
  onEdit,
  onToggleFavorite,
}) {
  return (
    <div className="flex shrink-0 flex-wrap gap-2">
      <IconButton
        onClick={onCopy}
        icon={<Copy size={17} />}
        label={copied ? "Copied" : "Copy"}
        dark
      />
      <IconButton
        onClick={onToggleFavorite}
        active={isFavorite}
        icon={
          <Star
            size={17}
            className={isFavorite ? "fill-yellow-400 text-yellow-400" : ""}
          />
        }
        label={isFavorite ? "Unfavorite" : "Favorite"}
      />
      <IconButton onClick={onEdit} icon={<Pencil size={17} />} label="Edit" />
      <IconButton
        onClick={onDelete}
        icon={<Trash2 size={17} />}
        label="Delete"
        danger
      />
    </div>
  );
}
