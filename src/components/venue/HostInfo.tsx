import type { Venue } from "../../types/api";

interface HostInfoProps {
  owner: NonNullable<Venue["owner"]>;
}

export default function HostInfo({ owner }: HostInfoProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <h2 className="text-lg font-semibold mb-2">Hosted by</h2>
      <p className="text-gray-700">
        {owner.name} ({owner.email})
      </p>
    </div>
  );
}
