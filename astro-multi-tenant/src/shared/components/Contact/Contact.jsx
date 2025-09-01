// Removed Next.js Image import

import TitleHeader from '../Headers/TitleHeader.jsx'

const Contact = () => {
  return (
    <>
      <TitleHeader
        title="Contact Me"
        description={
          'I look forward to any and all future projects. Let me help take your companies ideas to the next level.'
        }
        image="/images/envelope.png"
        imageDesc="Envelope"
      />

      <div className="h-5"></div>

      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="items-center justify-center text-center font-poppins font-bold text-header_smtitlept pt-5 text-black">
          <p>Preston Garrison</p>
        </div>
        <div className="items-center justify-center text-center font-poppins font-bold text-header_descpt">
          <a
            href="mailto:resume@prestongarrison.com"
            className="text-blue-600 font-semibold hover:underline"
          >
            resume@prestongarrison.com
          </a>
        </div>
        <div className="items-center justify-center text-center font-poppins font-bold text-botpt pb-5 pt-5">
          <a href="tel:+14803887766" className="text-red-800 font-semibold hover:underline">
            +1 (480) 388-7766
          </a>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-2">Follow Me</h2>
        <p className="text-lg text-gray-600 mb-8">Connect with me on social media</p>

        <div className="flex justify-center space-x-6">
          <a
            href="https://www.facebook.com/proggod"
            target="_blank"
            className="text-gray-400 hover:text-blue-600"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
              alt="Facebook"
              width={40}
              height={40}
            />
          </a>

          <a
            href="https://x.com/AskPreston"
            target="_blank"
            className="text-gray-400 hover:text-blue-400"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
              alt="Twitter"
              width={40}
              height={40}
            />
          </a>

          <a
            href="https://www.instagram.com/prestonflightone/"
            target="_blank"
            className="text-gray-400 hover:text-pink-600"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733558.png"
              alt="Instagram"
              width={40}
              height={40}
            />
          </a>

          <a
            href="https://www.linkedin.com/in/MrFlightOne"
            target="_blank"
            className="text-gray-400 hover:text-blue-700"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733561.png"
              alt="LinkedIn"
              width={40}
              height={40}
            />
          </a>
        </div>
      </div>

      <div className="h-96"></div>
    </>
  )
}

export default Contact
