export default function Footer() {
  return (
    <>
      <div className="w-full font-bold pb-8 py-4 bg-geo-lightbg dark:bg-geo-darkbg text-center text-sm text-geo-primary dark:text-geo-darkprimary">
        © {new Date().getFullYear()} GeofisicaHub.
        <a href="https://www.linkedin.com/in/andre-albano/" target="blank">
          André Albano
        </a>
      </div>
    </>
  );
}
