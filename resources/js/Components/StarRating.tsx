import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: number;
}

export function StarRating({ rating, reviewCount, size = 14 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? "fill-[#F59E0B] text-[#F59E0B]"
              : "fill-gray-200 text-gray-200"
          }
        />
      ))}
      {reviewCount !== undefined && (
        <span className="text-xs text-[#6B7280] ml-1">({reviewCount.toLocaleString("id-ID")})</span>
      )}
    </div>
  );
}
