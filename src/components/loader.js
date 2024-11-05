import "@/assets/css/loader.modules.css";
import Image from "next/image";

export function Loader2() {
  return (
    <>
      <section className="grid place-content-center min-h-screen dark-theme w-full h-full">
        <div className="loader w-full">
          <div>
            <div>
              <span className="one h6"></span>
              <span className="two h3"></span>
            </div>
          </div>

          <div>
            <div>
              <span className="one h1"></span>
            </div>
          </div>

          <div>
            <div>
              <span className="two h2"></span>
            </div>
          </div>
          <div>
            <div>
              <span className="one h4"></span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// export function Loader3() {
//   return (
//     <section className="fixed z-50 grid place-content-center w-screen h-screen dark-theme">
//       <Image
//         src={`/images/loader/loader.gif`}
//         height={1000}
//         width={1000}
//         alt="loader"
//       />
//     </section>
//   );
// }

export function Loader1() {
  return (
    <section className="grid place-content-center min-h-screen dark-theme w-full h-full">
      <div className="spinner center">
        <div className="spinner-blade"></div>
        <div className="spinner-blade"></div>
        <div className="spinner-blade"></div>
        <div className="spinner-blade"></div>
        <div className="spinner-blade"></div>
        <div className="spinner-blade"></div>
        <div className="spinner-blade"></div>
        <div className="spinner-blade"></div>
        <div className="spinner-blade"></div>
        <div className="spinner-blade"></div>
        <div className="spinner-blade"></div>
        <div className="spinner-blade"></div>
      </div>
    </section>
  );
}