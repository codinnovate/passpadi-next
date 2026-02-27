import ReviewCard from "../ui/review-card";

const reviews = [
  {
    name: "John Doe",
    role: "JAMB & POST-UTME Student",
    initials: "JD",
    rating: 5,
    text: "90percent is an excellent study app that makes exam preparation easier, smarter, and more effective.",
    highlight: true,
  },
  {
    name: "Emily Smith",
    role: "JAMB & POST-UTME Student",
    initials: "ES",
    rating: 5,
    text: "A smooth and well-designed app that helps students practice and gain confidence for their exams.",
  },
  {
    name: "Michael Johnson",
    role: "JAMB & POST-UTME Student",
    initials: "MJ",
    rating: 5,
    text: "90Percent delivers quality questions and a great learning experience that truly boosts performance.",
  },
  {
    name: "Emily Smith",
    role: "JAMB Student",
    initials: "ES",
    rating: 5,
    text: "It makes exam preparation easier and more effective.",
  },
  {
    name: "Michael Johnson",
    role: "JAMB Student",
    initials: "MJ",
    rating: 5,
    text: "90Percent is an excellent study app that makes exam preparation easier, smarter, and more effective.",
  },
  {
    name: "Emily Smith",
    role: "JAMB Student",
    initials: "ES",
    rating: 5,
    text: "90Percent is an excellent study app, exam preparation easier, smarter, and effective.",
  },
];

export default function Reviews() {
  return (
    <section id="reviews" className="bg-gray-50 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-screen-xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-app-secondary md:text-4xl">
          Reviews from our users
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, idx) => (
            <ReviewCard key={idx} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}
