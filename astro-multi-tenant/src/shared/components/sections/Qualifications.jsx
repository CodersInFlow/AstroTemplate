import Skills from './Skills.jsx'
import TitleHeader from '../Headers/TitleHeader.jsx'
import DevComponentWrapper from '../Dev/DevComponentWrapper.jsx'

const Qualifications = ({ headerData = {}, skillsData = {} }) => {
  // Extract header data with defaults
  const {
    title = "Qualifications",
    description = "Over the past two decades, I've had the privilege of bringing a wide range of innovative projects to market. From leading teams across the world to achieve multiple world and U.S. championships, to spearheading the development of cutting-edge and highly successful technologies, my journey has been both challenging and rewarding. I have met many interesting people, and feel thankful for all my experiences.",
    image = "/images/cartoon_preston2.png",
    imageDesc = "Preston Garrison"
  } = headerData;

  // Get skills array from data
  const skills = skillsData.skills || [];

  return (
    <>
      <DevComponentWrapper componentName="TitleHeader" dataPath="qualifications-header.json" componentId="qualifications-header">
        <TitleHeader
          title={title}
          description={description}
          image={image}
          imageDesc={imageDesc}
        />
      </DevComponentWrapper>
      
      {/* Loop through all skill categories */}
      {skills.map((skillCategory, index) => (
        <DevComponentWrapper 
          key={index}
          componentName="Skills" 
          dataPath="skills.json" 
          componentId={`skills-${skillCategory.name.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <Skills
            color={skillCategory.color}
            items={skillCategory.items || []}
            title={skillCategory.name}
            description={skillCategory.description}
          />
        </DevComponentWrapper>
      ))}
    </>
  )
}

export default Qualifications