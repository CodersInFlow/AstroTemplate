import Skills from './Skills.jsx'
import TitleHeader from '../Headers/TitleHeader.jsx'

const Qualifications = ({ skillsData = {} }) => {
  return (
    <>
      <TitleHeader
        title="Qualifications"
        description={
          'Over the past two decades, I’ve had the privilege of bringing a ' +
          'wide range of innovative projects to market. From leading teams ' +
          'across the world to achieve multiple world and U.S. championships, ' +
          'to spearheading the development of cutting-edge and highly ' +
          'successful technologies, my journey has been both challenging and ' +
          'rewarding. I have met many interesting people, and feel thankful ' +
          'for all my experiences.'
        }
        image="/images/cartoon_preston2.png"
        imageDesc="Preston Garrison"
      />
      <Skills
        color="bg-blue-600"
        items={skillsData.programming_languages || []}
        title="Programming Languages"
        description={
          'My preferred programming languages are C and C++ due to the control and power they offer over project development. ' +
          'I value the ability to manage projects with precision, which is why I have developed and used many of my own ' +
          'libraries over the years, avoiding the challenges that can arise when relying on third-party code. For ' +
          'cross-platform software development, I favor JavaScript, while Python is my go-to language for Unix-based programs ' +
          'and automation tasks. When reverse engineering or working on smaller functions for embedded platforms, I utilize ' +
          'assembly languages. Additionally, I have experience using C# for developing Windows applications.'
        }
      />
      <Skills
        color="bg-purple-600"
        items={skillsData.web_frameworks || []}
        title="Web Frameworks"
        description={
          'For web development my preferred combination is HTML, TailwindCSS with Javascript.  For the backend I have ' +
          'utilized PHP, and python via DJango and Flask, as well as C using my own web server, that allows protected modules ' +
          'to run directly inside developed purely in C.  I also developed my own server side HTML that includes a language ' +
          'that many of my projects have used.  This allows my websites to integrate smoothly with the C modules in my own ' +
          'web server. ' +
          '<br><br> ' +
          'Our drone configuration client uses Javascript, React and Electron to create a stand alone configurator available ' +
          'on Windows, MacOS and Linux.  The original version was written using Angular, but I have found React to be better ' +
          'suited. '
        }
      />
      <Skills
        color="bg-green-500"
        items={skillsData.operating_systems || []}
        title="Operating Systems"
        description={
          'Throughout my career, I have worked extensively with a wide range of operating systems, including IBM Mainframe, ' +
          'VAX, Solaris, and Irix. Among these, Irix stood out as a particular favorite, inspiring the architecture of my web ' +
          'server, which was modeled after the Irix Application Server. ' +
          '<br><br> ' +
          'In the early stages, I primarily relied on FreeBSD as the server platform of choice due to its superior thread ' +
          'management and stability. This robust foundation enabled my initial project to serve 10 million unique clients and ' +
          'handle ten times that number in requests, all from a Pentium 3 1GHz processor. Over time, as Linux evolved to ' +
          'match FreeBSD’s stability, I transitioned to using CentOS or Ubuntu, benefiting from their broader hardware and ' +
          'software support. ' +
          '<br><br> ' +
          'For desktop use, I prefer macOS for its stability and performance, though I also maintain regular use of Windows ' +
          'to ensure versatility across platforms.'
        }
      />
      <Skills
        color="bg-yellow-400"
        items={skillsData.networking || []}
        title="Networking"
        description={
          'Owning my own company and for a good period of time running my own data center, I was involved in the day to day ' +
          'operations of network and server administration.  I regularly maintain and configure our network of servers, ' +
          'firewalls and routers.  At one time I had a node network of hundreds of servers deployed across the world. '
        }
      />
      <Skills
        color="bg-blue-800"
        items={skillsData.embedded_technology || []}
        title="Embedded Technology"
        description={
          'Majority of my designs and software have been written to utilize the STM32 family of processors.  When internet ' +
          'integration is needed, we rely on the ESP32 platform.  Our drone software utilizes our own real time operating ' +
          'system that allows us to achieve unbelievable results on modest STM32 processors, like the STM32F4, STM32F7 and ' +
          'STM32H7.'
        }
      />
      <Skills
        color="bg-green-400"
        items={skillsData.hardware_debugging || []}
        title="Hardware Debugging & Development"
        description={
          'Over the years I have used a few different PCB Design software, but prefer KiCad over the majority of choices.  I have also found the Segger J-Link gives us the best results for hardware debugging, integrated with Visual Studio Code'
        }
      />
      <Skills
        color="bg-cyan-300"
        title="Videography and Photography"
        items={skillsData.videography_and_photography || []}
        description={
          'My drone company required a lot of social media, mostly YouTube, Facebook and Instagram.  Most videos and photos were shot using the sony A7 camera lines, edited in photoshop and Final Cut Pro.  Social media really helped our company grow quickly.'
        }
      />
    </>
  )
}

export default Qualifications
