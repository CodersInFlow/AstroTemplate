import TitleHeader from '../Headers/TitleHeader.jsx'
import ProjectItem from '../Cards/ProjectItem.jsx'
import DevComponentWrapper from '../Dev/DevComponentWrapper.jsx'

const Projects = ({ projectItems = [], header = {} }) => {
  const {
    title = "Projects",
    description = 'Over the years I have taken part in creating many different technologies and projects.',
    image = "/images/h7group_trans.png",
    imageDesc = "Lightning Flight Controller"
  } = header;

  return (
    <>
      <DevComponentWrapper componentName="TitleHeader" dataPath="projects.json" componentId="projects-header">
        <TitleHeader
          title={title}
          description={description}
          image={image}
          imageDesc={imageDesc}
        />
      </DevComponentWrapper>

      <div className="flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 p-[20px] w-full md:w-[960px]">
          {projectItems.map(item => (
            <DevComponentWrapper 
              key={item.id}
              componentName="ProjectItem" 
              dataPath="projects.json" 
              componentId={`project-item-${item.id}`}
            >
              <ProjectItem
                image_name={item.image_name}
                image_desc={item.image_desc}
                title={item.title}
                desc={item.desc}
              />
            </DevComponentWrapper>
          ))}
        </div>
      </div>
    </>
  )
}

export default Projects