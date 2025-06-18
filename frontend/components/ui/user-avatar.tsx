import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  fullName: string;
  email?: string;
  avatar?: string;
  size?: "sm" | "md" | "lg";
  showInfo?: boolean;
}

export const UserAvatar = ({
  fullName,
  email,
  avatar,
  size = "md",
  showInfo = true,
}: UserAvatarProps) => {
  // Generate initials from fullName
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // Generate background color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-gradient-to-br from-blue-500 to-blue-600",
      "bg-gradient-to-br from-green-500 to-green-600",
      "bg-gradient-to-br from-purple-500 to-purple-600",
      "bg-gradient-to-br from-pink-500 to-pink-600",
      "bg-gradient-to-br from-indigo-500 to-indigo-600",
      "bg-gradient-to-br from-red-500 to-red-600",
      "bg-gradient-to-br from-yellow-500 to-yellow-600",
      "bg-gradient-to-br from-teal-500 to-teal-600",
      "bg-gradient-to-br from-orange-500 to-orange-600",
      "bg-gradient-to-br from-cyan-500 to-cyan-600",
    ];

    const index =
      name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
      colors.length;
    return colors[index];
  };

  // Size classes
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  const avatarSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-3">
      <Avatar className={`${avatarSize} ring-2 ring-white shadow-md`}>
        <AvatarImage src={avatar || ""} alt={fullName} />
        <AvatarFallback
          className={`${getAvatarColor(fullName)} text-white font-semibold`}
        >
          {getInitials(fullName)}
        </AvatarFallback>
      </Avatar>
      <div>
        <div className="font-semibold text-gray-900 dark:text-gray-100">
          {fullName}
        </div>
      </div>
    </div>
  );
};
