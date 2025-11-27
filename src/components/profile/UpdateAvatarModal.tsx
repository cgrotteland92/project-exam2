import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { updateAvatar } from "../../api/authApi";
import Button from "../ui/Button";

interface UpdateAvatarModalProps {
  username: string;
  token: string;
  isOpen: boolean;
  onClose: () => void;
  onAvatarUpdated: () => void;
}

export default function UpdateAvatarModal({
  username,
  token,
  isOpen,
  onClose,
  onAvatarUpdated,
}: UpdateAvatarModalProps) {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarAlt, setAvatarAlt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!avatarUrl.trim()) {
      toast.error("Please enter a valid URL.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateAvatar(username, token, avatarUrl.trim(), avatarAlt.trim());
      toast.success("Avatar updated successfully!");
      setAvatarUrl("");
      setAvatarAlt("");
      onAvatarUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update avatar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-md flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-100"
      >
        <h2 className="text-2xl font-semibold text-stone-900 mb-6">
          Update avatar
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Alt text (optional)
            </label>
            <input
              type="text"
              value={avatarAlt}
              onChange={(e) => setAvatarAlt(e.target.value)}
              placeholder="Profile picture"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Save avatar
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
