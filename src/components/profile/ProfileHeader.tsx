import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import type { ProfileResponse } from "../../types/api";

interface ProfileHeaderProps {
  profile: ProfileResponse;
  onEditAvatar: () => void;
}

export default function ProfileHeader({
  profile,
  onEditAvatar,
}: ProfileHeaderProps) {
  const navigate = useNavigate();
  const isManager = profile.venueManager;

  return (
    <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100/50 hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Avatar */}
        <div className="relative group">
          <img
            src={profile.avatar?.url || "https://placehold.co/200x200"}
            alt={profile.avatar?.alt || profile.name}
            className="w-32 h-32 rounded-2xl object-cover border-2 border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-300"
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            {profile.name}
          </h1>
          <p className="text-gray-500 mb-4">{profile.email}</p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-center sm:justify-start">
            <span
              className={`inline-flex items-center px-4 py-1.5 text-sm font-medium rounded-full ${
                isManager
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {isManager ? "Venue Manager" : "Customer"}
            </span>

            {profile._count && (
              <div className="flex gap-4 text-sm">
                <span className="text-gray-600">
                  <strong className="text-gray-900 font-semibold">
                    {profile._count.bookings ?? 0}
                  </strong>{" "}
                  Bookings
                </span>
                {isManager && (
                  <span className="text-gray-600">
                    <strong className="text-gray-900 font-semibold">
                      {profile._count.venues ?? 0}
                    </strong>{" "}
                    Venues
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {isManager && (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => navigate("/manager")}
            >
              Go to Manager Dashboard
            </Button>
          )}

          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onEditAvatar}
          >
            Edit avatar
          </Button>
        </div>
      </div>
    </div>
  );
}
