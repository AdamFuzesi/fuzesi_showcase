const logotext = "ADAM C. FUZESI";
const meta = {
    title: "Adam Fuzesi",
    description: "I'm a Software Engineer and Computer Science Student",
};

/**
 * Resume and portfolio points to add:
 * 
 * RESMED work (intro and deep dive into platform engineering and talking about my project)
 * 
 * Blockchain Involvement including: Hackathons and travel, Lead developer for the 2025-2026 season
 * 
 * Adding FirstIn founding engineer 
 * 
 * Adding the AWS AI practicioner certificate
 * 
 * Adding in projects worked on (hackathon and personal projects, ie Aptos Pixels, Mosaic, Vision)
 * 
 * Korea University update, specifics on courses and involvement
 * 
 * PORTFOLIO CONTENT:
 * 
 * Most of the things said above, images in sort of a blog format of a bunhc of things like hackathons, resmed, gala, blockchain team etc.
 * Updating the proejcts section with the things mentioned above, update the involvement section.
 * 
 * Overall update the UI as well.
 * 
 * RESUME CONTENT:
 * 
 * Projects and the work involvement, Korea Update, certificate update, year update, overall restructuring of my projects and experience sections.
 * 
 * TO REMOVE FROM RESUME:
 * 
 * Student Pharmacist assitant job
 * 
 * Some of the involvmenet and repalce by better shit
 * 
 * better projects
 * 
 */

const profile = {
    name: "Adam C. Fuzesi",
    shortName: "Adam",
    headline: "Final-year Computer Science student at Dalhousie University (graduating 2026), minor in Mathematics and Economics.",
    // About Me → General: the print on the registration card (4:5 crop of IMG_3066).
    portrait: "/images/os/portrait.jpg",
    // Labelled facts on the registration card, in display order.
    facts: [
        { label: "Now", value: "Design Engineer @Locus" },
        { label: "Before", value: "Ex SWE @American Express (Accenture)" },
        { label: "Certified", value: "AWS  ·  GCP  ·  Azure" },
        { label: "Alum", value: "Korea University — School of Artificial Intelligence" },
        { label: "Roots", value: "Hungarian/Canadian" },
    ],
    wallpaper: "/images/os/wallpaper-hike.jpg",
};

const introdata = {
    
    title: "Hey, I'm Adam",
    animated: {
        first: "Design Engineer @Locus",
        second: "Ex SWE @American Express",
        third: "Google Cloud Certified",
        fourth: "Hungarian/Canadian",
        fifth: "BCS student minoring in Mathematics"
    },
    description: "Get to know a little about me...",
    intro_img_url: "/images/evenBetterStudious.png",
    // changed to be based on the use case to showcase and make sure it matches it based off the animation
};

const dataabout = {
    title: "A bit about myself...",
    aboutme: "Currently in my third year at Dalhousie University studying Computer Science with minors in Mathematics and Economics, I also serve as the Bachelor of Computer Science Representative for my faculty, and the Lead Developer for the Blockchain Society. My software engineering journey began early in high school, developing simple Python scripts and applications for personal use, or offering my services to local businesses looking to have leap into technology, and has since expanded to include significant projects and live applications, competitive programming, and professional work through various internships. Beyond programming, I'm passionate about competitive Tennis and Photography, which gives me a creative and disciplined outlet away from the screen. Committed to my continuous learning field, I actively enjoy pursuing new certifications, continuously working on various UI/UX designs, practicing with my fellow competitive programming teammates for the ICPC, and continuously work on new side projects, constantly seeking to enhance my skills and stay ahead in the ever-evolving tech landscape!",
};

/**
 * Work history, newest first. Shown in Experience & Background → Work.
 * Optional fields per entry (the window only renders what's present):
 *   description: ["paragraph", ...] — what you did in the role
 *   project:     the product/program, e.g. "Lumi platform"
 *   location:    e.g. "San Diego"
 *   model:       a 3D mark spun on the showcase — "/models/<file>.glb", or an SVG logo
 *                ("/models/logos/<file>.svg") that gets extruded into 3D. Pass an array to have
 *                several marks take turns. Without one, an outlined monogram is shown.
 */
const worktimeline = [
    {
        jobtitle: "Lead Full-Stack & Design Engineer",
        where: "Locus (YC F25)",
        date: "03/2026 - Present",
        model: "/models/locus-logo.glb",
        description: [
            "Building the product side of an AI platform that starts and runs internet businesses on its own. I own the payments and metering layer: one prepaid balance that routes and meters every call an agent makes, maps cost per task in real time, and settles markup as revenue.",
            "I also built the conversational layer across iMessage, Telegram, and web, which turns plain-language requests into typed actions the user approves. On the design side, I built the onboarding, dashboard, and admin surfaces, plus the design system and motion language.",
        ],
    },
    {
        jobtitle: "Software Engineer",
        where: "American Express (Accenture)",
        date: "05/2026 - 08/2026",
        project: "Lumi platform",
        model: ["/models/logos/amex.svg", "/models/logos/accenture.svg"],
        description: [
            "Moving AMEX's legacy Cornerstone data onto Google Cloud. I build and test ingestion pipelines on Dataflow, Pub/Sub, Airflow, BigQuery, and Spanner, write regression tooling to check that migrated data matches the source, and ship DAGs to Cloud Composer.",
        ],
    },
    {
        jobtitle: "Platform Engineer Intern",
        where: "ResMed",
        date: "05/2025 - 09/2025",
        location: "San Diego",
        model: "/models/logos/resmed.svg",
        description: [
            "Platform engineering on the team behind ResMed's connected-care products.",
            "Built a SonarQube-based code quality review system for the platform that 40+ engineering teams ship on. It automatically catches bugs, vulnerabilities, and code smells in the pipeline before merge. It's still in production across ResMed's engineering org.",
        ],
    },
    {
        jobtitle: "Cloud Engineer Intern",
        where: "DeepSense",
        date: "05/2024 - 09/2024",
        model: "/models/logos/deepsense.svg",
        description: [
            "Designed the cloud data pipelines behind ocean and environmental datasets at Dalhousie's ocean-data lab.",
            "The client liked the work enough to keep me on part-time as a Machine Learning Engineer after the internship. In that role I built predictive models on aquaculture and environmental data, using a multi-model stack (LightGBM, survival models, temporal CNNs, Bayesian NNs) to forecast outcomes for a fish-farming platform in Portugal.",
        ],
    },
];

// add in code languages image based visual aspect next to the names of the languages
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
        image: "/images/react.svg"
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
        title: "Locus",
        role: "Lead Design Engineer",
        description: "Lead design engineer at Locus (YC F25), owning design end to end. I built the brand identity, the design system and motion language every surface is made from, and the design-agent orchestration that lets AI agents generate and ship on-brand UI inside that system. It carries across the whole product, from the marketing site to onboarding, dashboard and admin, and into launches like Checkout with Locus, a Stripe-style checkout that lets AI agents pay.",
        image: "images/locus.png"
    },
    {
        title: "Yorigo | React Native, Typescript, PostgreSQL, Coupang API, Gemini API",
        description: "Mobile app built during my time in Korea, currently #32 on the Korean App Store charts. Yorigo turns short-form cooking content into a shoppable grocery order: a pipeline ingests recipes from YouTube, Instagram and TikTok, extracts and structures the ingredients with multimodal extraction over the video, audio and captions, and routes them to a one-tap checkout across Korean commerce platforms (Coupang and Market Kurly). Started as a hackathon project that won 1st place at HackSeoul, then gained traction and was incubated by NAVER.",
        image: "images/yorigo.png",
        // Portrait app screenshot — shown on a spinning 3D phone in the Projects light table.
        screen: "images/screens/yorigo.jpg",
        link: "https://yorigo.kr/"
    },
    {
        title: "FirstIn | Swift, SwiftUI, Xcode, AWS, React, Stripe API",
        description: "Founding Engineer behind the FirstIn iOS app, defining the end-to-end architecture of the full mobile and web stack, including a full-scale CRM platform for the businesses using our software. Integrated a secure Stripe payment flow, implemented QR/digital ticket issuance and redemption, and built an admin portal giving venues real-time ticket analytics and streamlined partner management. Over 20 businesses across Canada and over 24,000 downloads.",
        image: "images/firstIn.png",
        screen: "images/screens/firstin.jpg",
        link: "https://firstin.app/about"
    },
    {
        title: "Polarity",
        role: "Fellow · Brand Ambassador",
        description: "Selected as a Polarity fellow, where I served as a brand ambassador for the company. Beyond representing Polarity in the community, I helped shape the overall brand: how it looks, how it sounds, and how its product and research are presented, keeping every touchpoint consistent with the team's voice.",
        image: "images/polarity.png"
    },
    {
        title: "ViewMax",
        role: "Design Engineer (Contract)",
        description: "Contracted to design and build ViewMax's landing page in a design-engineer role, owning it from visual direction through to production. I set up the design system behind it (type scale, colour and spacing tokens, and a library of reusable components) so new sections ship quickly without drifting off-brand, and optimized the page so a media-heavy experience still loads fast and feels smooth.",
        image: "images/viewmax.png"
    },
    {
        title: "Hieta",
        role: "Design Engineer (Contract)",
        description: "Contracted design engineer for Hieta's commerce site during my time in Korea. I designed and built the storefront experience, from product listings and collection pages to the editorial sections, with a clean, restrained layout that lets the pieces lead and makes browsing to checkout feel effortless.",
        image: "images/hieta.png",
        link: "https://hieta.co.kr/"
    },
    {
        title: "Kickit Web Dev | React, Typescript, GraphQL, Wordpress ",
        description: "Co-founded a web development venture, enhancing SEO through Server side Rendering. Developed a streamlined pipeline for custom websites using React and WordPress, making it seamless to deliver efficient and high quality websites and applications to clients, and led e-commerce integrations utilizing Node.js with Shopify's GraphQL API. Currently catering to 5 businesses across Canada.",
        image: "images/kickit.png",
        link: "https://www.kickitweb.ca/"
    },
    {
        title: "Mosaic | Typescript, Node.js, Stellar Blockchain",
        description: "Built for the Consensus 2025 Hackathon in Toronto, it's a passkey-based crypto wallet designed for a seamless user experience. Aiming to simplify crypto transactions by incorporating familiar features from apps like Venmo and PayPal, while also offering unique functionalities like cash deposits via MoneyGram. I encourage you to explore our features and provide any feedback you might have.",
        image: "images/mosaic.png",
        link: "https://www.loom.com/share/675256788d13441fac23942379359ac4?sid=715c01f1-cafa-4c85-8cfe-bd6ba749a3ec"
    },
    {
        title: "RedBull Basement Team Canada",
        role: "UI Designer",
        description: "Co-led UI design and front-end development for Estate Lynx, Team Canada’s finalist entry in the RedBull Basement global pitch competition in Japan. The AI-powered platform provides real-time listings, key metrics, and personalized insights, making real estate investment accessible for novices. After the competition, I continued as a front-end developer, in preparation for launch. ",
        image: "images/redbullGood.png",
        link: "https://www.redbull.com/ca-en/events/red-bull-basement-canada/red-bull-basement-canada-winners"
    },
    {
        title: "Yellow Submarine | C, OpenGL, GLUT",
        description: "3D underwater submarine simulation with multiple environment models and a responsive flock of fish created by implementing Craig Reynolds's Boid algorithm into a 3D rendered environment. Programmed fully with C utlizing the OpenGL Library.",
        image: "images/yellowSubmarine.png",
        link: "https://github.com/AdamFuzesi/Yellow-Submarine/tree/main"

    },
    {
        title: "AptosPixel |  React, Tailwind CSS, Aptos Blockchain, Framer",
        description: "Built for Toronto Hack 2025, aptos Pixel allows users to purchase, own, and customize single pixels on a shared digital canvas, creating a permanent space for businesses, communities, and personal brands in a truly decentralized way.",
        image: "images/aptos.png",
        link: "https://www.loom.com/share/3eb900e79e9345f7bb2611b4b7952cca?sid=40424c8b-bdcc-4bd2-948c-9c36eff6570f"
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
        title: "Blockchain Society, Lead of Development",
        description: "Lead of Dalhousie's Hackathon team. Leading the intricate team of developers and competing in world renowned hackathons such as EigenGames, EthDenver, HackTheNorth, Consensus Toronto, competing amongst the best student developers across the world.",
        image: "images/blockchaindev.png",
        link: "https://www.dalbcs.com/"
    },
    {
        title: "FirstIn Founding Engineer",
        description: "Founding Engineer of FirstIn, a VIP nightlife line skip app. Built the full mobile and web stack from the ground up, now used by over 20 venues across Canada with over 24,000 downloads.",
        image: "images/firstinInvolvement.png",
        link: "https://firstin.app/about"
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
      title: "Dal Linux Society",
      description:
              "Though my main machine is an M1 Mac, I have configured my old Razer Blade Stealth laptop to Arch Linux, and became an active member of the Linux Society.",
      image: "images/linuxSoc.png",
      link: "https://linuxsociety.ca/#about"
    },
    {
        title: "Member of Google Developers Group Halifax",
        description:
        "Ongoing member of the halifax Google developers group. Attending virtual confereances and meeting with likeminded people to discuss and learn about google services.",
        image: "/images/googleHalifax.png",
        link: "https://gdg.community.dev/gdg-halifax/"

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
    profile,
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
