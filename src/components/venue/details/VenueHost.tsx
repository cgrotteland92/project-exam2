import { Icons } from "./VenueIcons";
import type { Avatar } from "../../../types/api";

interface VenueHostProps {
  owner?: {
    name: string;
    email: string;
    avatar?: Avatar;
    bio?: string;
  };
}

export default function VenueHost({ owner }: VenueHostProps) {
  if (!owner) return null;

  return (
    <div className="pt-6 border-t border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hosted by</h3>
      <div className="flex items-center gap-4">
        {owner.avatar?.url ? (
          <img
            src={owner.avatar.url}
            alt={owner.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
          />
        ) : (
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
            <Icons.User />
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900">{owner.name}</p>
          <p className="text-sm text-gray-500">{owner.email}</p>
          {owner.bio && (
            <p className="text-sm text-gray-600 mt-1 max-w-md">{owner.bio}</p>
          )}
        </div>
      </div>
    </div>
  );
}
