const logotext = "ADAM C. FUZESI";
const meta = {
    title: "Adam Fuzesi",
    description: "I'm a Software Engineer and Computer Science Student",
};

const introdata = {
    
    title: "Hey, I'm Adam",
    animated: {
        first: "Aspiring Software Engineer",
        second: "Google Cloud Certified",
        third: "Cloud Engineer Intern",
        fourth: "Hungarian/Canadian",
        fifth: "BCS student minoring in Mathematics"
    },
    description: "Get to know a little about me...",
    intro_img_url: "/images/evenBetterStudious.png",
    // changed based on the use case to showcase and make sure it matches it based off the animation
};

const dataabout = {
    title: "A bit about myself...",
    aboutme: "Currently in my third year at Dalhousie University studying Computer Science with minors in Mathematics and Economics, I also serve as the Bachelor of Computer Science Representative for my faculty. My software engineering journey began early in high school, developing Python scripts and applications for various businesses or personal use, and has since expanded to include significant contributions to open-source projects, competitive programming, and professional work as a cloud engineer intern. Beyond programming, I'm passionate about competitive Tennis and Photography, which gives me a creative and disciplined outlet away from the screen. Committed to my continuous learning field, I actively enjoy pursuing new certifications, practicing with my fellow competitive programming teammates for the ICPC, and continuously work on new projects, constantly seeking to enhance my skills and stay ahead in the ever-evolving tech landscape!",
};
const worktimeline = [{
        jobtitle: "Cloud Engineer ",
        where: "DeepSense",
        date: "04/2024 - 09/2024",
    },
    {
        jobtitle: "Healthcare IT programmer",
        where: "Vitality",
        date: "05/2020 - 09/2020",
    },
    {
        jobtitle: "Student Pharmacy Assistant",
        where: "Shoppers",
        date: "11/2018 - 03/2020",
    },
];

// add in code language image based visual aspect next to the names of the languages
const skills = [{
        name: "Python",
        image: "/images/pyhtonImage.png"
    },
    {
        name: "C++",
        image: "/images/cpp.png"
    },
    {
        name: "Javascript",
        image: "/images/javascript.png"
    },
    {
        name: "Typescript",
        image: "/images/typescript.png"

    },
    {
        name: "React",
        image: "/images/react.png"
    },
    {
        name: "Java",
        image: "/images/java.png"
    },
    {
        name: "C",
        image: "/images/c.png"
    },
    {
        name: "Swift",
        image: "/images/swift.png"
    },
    {
        name: "NodeJS",
        image: "/images/nodejsicon.png"
    },
    {
        name: "Figma",
        image: "/images/Figma-1-logo.png"
    },
    {
        name: "GraphQL",
        image : "/images/graphQLogo.png"
    },
    {
        name: "Google Cloud Platform",
        image: "/images/gCloud.png"
    },
    {
        name: "AWS",
        image: "/images/aws.svg"
    }

];

const services = [{
        title: "Kickit Web Dev | React, Typescript, GraphQL, Wordpress ",
        description: "Co-founded a web development venture, enhancing SEO through Server side Rendering. Developed a streamlined pipeline for custom websites using React and WordPress, making it seamless to deliver efficient and high quality websites and applications to clients, and led e-commerce integrations utilizing Node.js with Shopify's GraphQL API. Currently catering to 5 businesses across Canada.",
        image: "images/kickit.png",
        link: "https://www.kickitweb.ca/"
    },
    {
        title: "RedBull Basement Team Canada | UI Designer",
        description: "Co-led UI design and front-end development for Estate Lynx, Team Canada’s finalist entry in the RedBull Basement global pitch competition in Japan. The AI-powered platform provides real-time listings, key metrics, and personalized insights, making real estate investment accessible for novices. After the competition, I continued as a front-end developer, in preparation for launch. ",
        image: "images/redbullGood.png",
        link: "https://www.redbull.com/ca-en/events/red-bull-basement-canada/red-bull-basement-canada-winners"
    },
    {
        title: "Dune Yourself (Coming soon) | React + Vite, AWS",
        description: "A React-based application that prompts users to upload an image and complete a questionnaire inspired by the Dune universe. Leveraging AI and canonical lore, my program then generates a personalized character—from appearance to backstory, seamlessly integrating the new persona into established Dune lore. The result is a dynamic, lore rich narrative uniquely tailored to each user’s choices and image input!",
        image: "images/dune.png"
    },
    {
        title: "Yellow Submarine | C, OpenGL, GLUT",
        description: "3D underwater submarine simulation with multiple environment models and a responsive flock of fish created by implementing Craig Reynolds's Boid algorithm into a 3D rendered environment. Programmed fully with C utlizing the OpenGL Library.",
        image: "images/yellowSubmarine.png",
        link: "https://github.com/AdamFuzesi/Yellow-Submarine/tree/main"

    },
    {
        title: "Tennis ML Analyzer/Coach | Python, YOLOv8, Pytorch, Flask ",
        description: "Computer-vision based tennis analysis software using YOLOv8 and PyTorch, creating models with custom image datasets for enhanced object detection and tracking in video streams. Trained a CNN to extract keypoints, implemented complex tracking algorithms, and utilized OpenCV for robust video processing.",
        image: "images/tennisML.png"
    },
    {
        title: "Cache Simulation System | C ",
        description: "Project simulates a Cache memory system, enabling interaction between cache and main memory. It tracks and logs cache hits and misses, offering insights into memory access patterns. The system allows for customizable memory sizes and generates random data to populate the main memory, simulating real-world behavior. Additionally, it provides detailed cache performance statistics and verifies data integrity by ensuring the consistency of values between cache and main memory.",
        image: "images/cachingProj.png",
        link: "https://github.com/AdamFuzesi/cacheSim"
    },
    {
        title: "SixSlang Translator | Swift, Swift UI",
        description: "Swift based application that takes in a users sentence, either in proper English or < Toronto > English, then translates it accordingly.",
        image: "images/sixSlang.png",
        link: "https://github.com/AdamFuzesi/SixSlang"
    },
    {
        title: "Sequestration Model Nasa Space Apps | Python, Flask, JSON",
        description: "Developed for the NASA Space Apps Hackathon, web app based sequestration model enables users to explore historical carbon emissions and sequestration potential data across Canada. Using choropleth layers and heatmaps, the platform provides an interactive map based visualization of carbon dynamics in various provinces. Additionally, it highlights algae blooms in Alberta, illustrating localized sequestration potential.",
        image: "images/spaceApps.png",
        link: "https://algaeandco2.up.railway.app/"
    },
    {
        title: "Challenger | Swift, SwiftUI, AWS",
        description: "Currently in the early stages of development, I'm very excited to introduce Challengers, an iOS application designed to connect solo-sport players and introduce a competitive edge to casual community games. Key features include local matchmaking, progress tracking, facility and court bookings, as well as community-wide win/loss leaderboards, all aimed at fostering engaging and organized events for athletes of every level, bringing a nice competitive edge back casual players.",
        image: "images/challenger.png"
    },
    {
        title: "Magical Terminal Cube | C ",
        description: "Heavily math based C program that simulates a spinning cube within the terminal. One of my first C projects! ",
        image: "images/terminalCube.png",
        link: "https://github.com/AdamFuzesi/Magical-Terminal-Cube"
    },
    {
        title: "A* Algorithm Visualizer | Python, Pygame ",
        description: "Developed an interactive pathfinding algorithm visualizer in Python, using the PyGame library to create a dynamic simulation environment. Program features user-customizable parameters, enabling the adjustment of start and end points, and the placement of obstacles within the grid.",
        image: "images/aStarVisualizer.png",
        link: "https://github.com/AdamFuzesi/A-Visualizer"

    }
    // add new sections and update based off the best projects to showcase
];

const extracurricular = [
    {
        title: "Bachelor Of Computer Science Representative",
        description: "I have been given the honor to represent my faculty as the BCS representative. My main duties include acting as a connections between faculty members and students, planning events and hackathons, meeting with companies for potential events and assigning course representatives throughout our faculties courses each semester. Fun fact, I do not watch the Social Network on 2x speed every morning, but admire the movie quite a bit.",
        image: "images/cssCouncil.png",
        link: "https://society.cs.dal.ca/about/"
    },
    {
      title: "RedBull Case Competition UI/UX Designer",
      description:
        "Co-led the UI designs in the RedBull Basement competition team representing Canada in a worldwide competition. Still on this project, as the two owners are now working towards making the startup a successful reality. Will stay on the RealEstate Lynx team as a FullStack Developer.",
      image: "images/redbullExtra.png",
      link: "https://www.redbull.com/ca-en/events/red-bull-basement-canada"
    },
    {
      title: "ICPC Programming Team Member",
      description:
        "Active member of the ICPC competitive programming team at Dalhousie Univerisity. Practicing weekly tackling complex algorithmic challenges.",
      image: "images/ICPC.png"
    },
    {
      title: "Kickit Web Startup",
      description:
        "Co-founded a web development venture, building custom solutions in React, Node, and GraphQL for local businesses. Developed a streamlined pipeline for custom websites using React and WordPress, making it seamless to deliver efficient and high quality websites/applications to clients, and led e-commerce integrations utilizing Node.js with Shopify's GraphQL API. Currently catering to 5 businesses across Canada.",
      image: "/images/kickitWeb.png",
      link: "https://www.kickitweb.ca/"
    },
    {
        title: "Dalhousie BlockChain Programmer",
        description: "Member of Dalhousie's Blockchain Society as a fullstack developer. Will be competing in Eth Denver representing the University this upcoming february. ",
        image: "images/dalhousieBlock.png",
        link: "https://www.dalbcs.com/"
    },
    {
      title: "Dal Linux Society",
      description:
              "Though my main machine is an M1 Mac, I have configured my old Razer Blade Stealth laptop to Arch Linux, and became an active member of the Linux Society.",
      image: "images/linuxSoc.png",
      link: "https://linuxsociety.ca/#about"
    },
    {
      title: "Best Buddies",
      description: "Active member of the best buddies program, fostering friendships with individuals with intellectual disabilities.",
      image: "images/pleaseWork.png",
      link: "https://carty-party.glitch.me/#About"
    }
];


const dataportfolio = [{
        img: "https://picsum.photos/400/?grayscale",
        description: "",
        link: "#",
    },
    {
        img: "https://picsum.photos/400/800/?grayscale",
        description: "",
        link: "#",
    },
    {
        img: "https://picsum.photos/400/?grayscale",
        description: "",
        link: "#",
    },
    {
        img: "https://picsum.photos/400/600/?grayscale",
        description: "",
        link: "#",
    },
    {
        img: "https://picsum.photos/400/300/?grayscale",
        description: "",
        link: "#",
    },
    {
        img: "https://picsum.photos/400/700/?grayscale",
        description: "",
        link: "#",
    },

    {
        img: "https://picsum.photos/400/600/?grayscale",
        description: "",
        link: "#",
    },
    {
        img: "https://picsum.photos/400/300/?grayscale",
        description: "",
        link: "#",
    },
    {
        img: "https://picsum.photos/400/?grayscale",
        description: "",
        link: "#",
    },
    {
        img: "https://picsum.photos/400/550/?grayscale",
        description: "",
        link: "#",
    },
    {
        img: "https://picsum.photos/400/?grayscale",
        description: "",
        link: "#",
    },
    {
        img: "https://picsum.photos/400/700/?grayscale",
        description: "",
        link: "#",
    },
];

const contactConfig = {
    MY_EMAIL: "adamfuzeri@gmail.com",
    MY_ALTEMAIL: "AdamFuzesi@dal.ca",
    description: "Feel free to reach out to me through this form, or any of my Emails or Socials linked in the sidebar!",
    // creat an emailjs.com account 
    // check out this tutorial https://www.emailjs.com/docs/examples/reactjs/
    YOUR_SERVICE_ID: "service_tvxlvub",
    YOUR_TEMPLATE_ID: "template_7a4n2l8",
    YOUR_USER_ID: "xqk-KiWE2GjGCqEoj",
};

const socialprofils = {
    github: "https://github.com/AdamFuzesi",
    facebook: "https://facebook.com",
    linkedin: "https://www.linkedin.com/in/adam-fuzesi-217494296/",
    twitter: "https://twitter.com",
};
export {
    meta,
    dataabout,
    dataportfolio,
    worktimeline,
    skills,
    services,
    introdata,
    extracurricular,
    contactConfig,
    socialprofils,
    logotext,
};
