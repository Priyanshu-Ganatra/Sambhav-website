"use client";
import Footer from "@/components/footer";
import Socials from "@/components/socialLinks";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [isLowHeight, setIsLowHeight] = useState(false)
  useEffect(() => {
    const checkMobile = () => {
      setIsLowHeight(window.innerHeight < 764)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/contact/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to submit contact form");
      }
      // Reset form after successful submission
      setFormData({
        fullName: "",
        email: "",
        contact: "",
        message: "",
      });
      toast.success("Form submitted successfully!");
    } catch (error) {
      // console.error('Error submitting contact form:', error);
      toast.error("Failed to submit contact form. Please try again later.");
    }
  };

  return (
    <main className="dark-theme pt-24 flex flex-col justify-center items-center gap-4 h-full overflow-y-auto overflow-x-hidden">
      <div className={`flex items-center pt-24 relative w-full md:mt-0 mt-20 ${isLowHeight && 'mt-64'}`}>
        <div className="page-section relative mx-auto !my-4 block md:grid grid-cols-[40%_60%] w-full gap-28">
          <div className="flex gap-14 mb-10 px-5 pt-10 md:justify-start">
            <div className="contact-details flex flex-col gap-5 md:gap-10">
              <div>
                <label className="font-semibold">General Contact:</label>
                <div className="text-xs font-thin hover:underline text-gray-100">
                  <a href="mailto:info@sambhavgroup.co.in">
                    info@sambhavgroup.co.in
                  </a>
                </div>
              </div>

              <div>
                <label className="font-semibold">Press Inquiries:</label>
                <div className="text-xs font-thin hover:underline text-gray-100">
                  <a href="mailto:media@sambhavgroup.co.in">
                    media@sambhavgroup.co.in
                  </a>
                </div>
              </div>

              <div>
                <label className="font-semibold">Telephone:</label>
                <div className="text-xs font-thin hover:underline text-gray-100">
                  <a href="tel:+91 022 6666 6191">+91 022 6666 6191</a>
                </div>
              </div>

              <div>
                <label className="font-semibold">Address:</label>
                <div className="text-xs font-thin text-gray-100">
                  <a
                    target="_blank"
                    className="underline"
                    href="https://www.google.com/maps?ll=19.001453,72.829486&z=10&t=m&hl=en&gl=IN&mapclient=embed&cid=16372566543277093295"
                  >
                    1301, 13th floor, Lodha Supremus,
                    <br /> Senapati Bapat Marg, Opp World Tower, Lower Parel
                    (West),
                    <br /> Mumbai, Maharashtra, India.
                    <br />
                    Pincode- 400013.
                  </a>
                </div>
              </div>

              <div className="social-link flex gap-3 max-h-[250px] flex-wrap justify-start pr-5">
                <Socials iconsColor="white" />
              </div>
            </div>
          </div>

          <div className=" md:border-l-[0.5px] px-5 mt-2 md:px-[150px]">
            <form
              className="grid pt-8 grid-cols-[20%_80%] gap-7 w-full"
              onSubmit={handleSubmit}
            >
              <label className="font-semibold">Full Name</label>
              <input
                type="text"
                name="fullName"
                minLength="2"
                maxLength="20"
                pattern="[a-zA-Z\s]+"
                value={formData.fullName}
                onChange={handleChange}
                className="text-sm font-light text-black w-full px-2 py-[8px]"
                placeholder="Your full name"
                title="Please enter a valid name (alphabets and spaces only)"
                required
              />

              <label className="font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="text-sm font-light text-black w-full px-2 py-[8px]"
                placeholder="Your email"
                title="Please enter a valid email address"
                required
              />

              <label className="font-semibold">Contact</label>
              <input
                type="tel"
                name="contact"
                value={formData.contact}
                minLength="10"
                maxLength="10"
                pattern="[0-9]{10}"
                onChange={handleChange}
                className="text-sm font-light text-black w-full px-2 py-[8px]"
                placeholder="Your mobile number"
                title="Please enter a valid 10-digit contact number"
                required
              />

              <label className="font-semibold">Message</label>
              <textarea
                type="text"
                name="message"
                maxLength="500"
                minLength={30}
                value={formData.message}
                onChange={handleChange}
                className="text-sm font-light text-black w-full px-2 py-[8px] h-[120px] resize-none"
                placeholder="Query or message. Example: I am interested in learning more about..."
                required
              />

              <div></div>
              <button
                type="submit"
                className="focus:outline-none font-medium text-sm px-5 py-2.5 me-2 mb-2 w-full border-2 text-white hover:bg-white hover:text-black"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
