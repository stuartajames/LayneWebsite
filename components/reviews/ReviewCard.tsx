import type { Review } from "@/types";
import { StarRating } from "@/components/shared/StarRating";
import Image from "next/image";

type Props = { review: Review };

export function ReviewCard({ review }: Props) {
  const label = review.reviewType ?? "Verified review";

  return (
    <article className="flex flex-col rounded-lg bg-white shadow-sm ring-1 ring-black/5 overflow-hidden">
      {review.imageUrl && !review.imageUrl.includes("placeholder") && (
        <div className="relative h-48 w-full">
          <Image
            src={review.imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-brand-dark">{label}</span>
            <span className="text-xs text-gray-400">{review.date}</span>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
        <p className="text-sm leading-relaxed text-gray-600">{review.body}</p>
      </div>
    </article>
  );
}
