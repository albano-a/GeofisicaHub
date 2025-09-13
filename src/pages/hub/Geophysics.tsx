import books from "../../assets/books.json";
import BookCard from "../../components/BookCard";

export default function Geophysics() {
  const geophysicsBooks = books.geophysics;

  return (
    <>
      <div className="min-h-screen bg-geo-lightbg dark:bg-geo-darkbg pb-5 flex flex-col items-center justify-center">
        <h1 className="text-4xl py-10 font-bold text-geo-primary dark:text-geo-darkprimary mb-8">
          Geophysics
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {geophysicsBooks.map((book, index) => (
            <BookCard
              key={index}
              cover={book.cover}
              title={book.title}
              description={book.description}
              link={book.link}
            />
          ))}
        </div>
      </div>
    </>
  );
}
