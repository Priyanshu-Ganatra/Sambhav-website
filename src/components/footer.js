export default function Footer({ theme = "dark-theme" }) {
  return (
    <footer className={`relative w-full h-min mt-6 ${theme}`}>
      {/* <div>
                <Link>info@</Link>
            </div> */}

      <div className="flex justify-center items-center gap-3 border-0 border-t-[1px] py-4 text-xs">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="icon icon-tabler icons-tabler-outline icon-tabler-copyright"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          <path d="M14 9.75a3.016 3.016 0 0 0 -4.163 .173a2.993 2.993 0 0 0 0 4.154a3.016 3.016 0 0 0 4.163 .173" />
        </svg>
        <div>Sambhav Group</div>
      </div>
    </footer>
  );
}
