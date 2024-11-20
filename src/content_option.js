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
        fifth: "BCS student minoring in Mathematics and Economics"
    },
    description: "Get to know a little about me...",
    intro_img_url: "/images/IMG_3066.jpg",
    // changed based on the use case to showcase and make sure it matches it based off the animation
};

const dataabout = {
    title: "A bit about myself...",
    aboutme: "Currently in my third year at Dalhousie University studying Computer Science with minors in Mathematics and Economics, I also serve as the Bachelor of Computer Science Representative for my faculty. My software engineering journey began early in high school, developing Python scripts and applications for various businesses or personal use, and has since expanded to include significant contributions to open-source projects, competitive programming, and professional work as a cloud engineer intern. Beyond programming, I'm passionate about competitive Tennis and Photography, which gives me a creative and disciplined outlet away from the screen. Committed to my continuous learning field, I actively enjoy pursuing new certifications and continuously work on new projects, constantly seeking to enhance my skills and stay ahead in the ever-evolving tech landscape!",
};
const worktimeline = [{
        jobtitle: "Cloud Engineer ",
        where: "DeepSense",
        date: "04/2024 - 09/2024",
    },
    {
        jobtitle: "Fullstack Developer",
        where: "Kickit Web Dev",
        date: "03/2024 - Ongoing ( Side Project )"
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
        name: "C#",
        image: "/images/cSharp.png"
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
        description: "Co-founded a web development venture, enhancing SEO through Server-Side Rendering. Developed a streamlined pipeline for custom websites using React and WordPress, and led e-commerce integrations using Node.js with Shopify's GraphQL API. Currently catering to 5 businesses across Canada.",
        image: "images/kickit.png"
    },
    {
        title: "Tennis ML Analyzer/Coach | Python, YOLOv8, Pytorch, Flask ",
        description: "Computer-vision based tennis analysis software using YOLOv8 and PyTorch, creating models with custom image datasets for enhanced object detection and tracking in video streams. Trained a CNN to extract keypoints, implemented complex tracking algorithms, and utilized OpenCV for robust video processing. Flask-based web interface for user-driven video analysis.",
        image: "images/tennisML.png"
    },
    {
        title: "Cache Simulation System | C ",
        description: "Project simulates a Cache memory system, enabling interaction between cache and main memory. It tracks and logs cache hits and misses, offering insights into memory access patterns. The system allows for customizable memory sizes and generates random data to populate the main memory, simulating real-world behavior. Additionally, it provides detailed cache performance statistics and verifies data integrity by ensuring the consistency of values between cache and main memory.",
        image: "images/cachingProj.png"
    },
    {
        title: "A* Algorithm Visualizer | Python, Pygame ",
        description: "Developed an interactive pathfinding algorithm visualizer in Python, using the PyGame library to create a dynamic simulation environment. Program features user-customizable parameters, enabling the adjustment of start and end points, and the placement of obstacles within the grid.",
        image: "images/aStarVisualizer.png"

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
    contactConfig,
    socialprofils,
    logotext,
};
