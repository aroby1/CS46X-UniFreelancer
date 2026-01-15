require("dotenv").config();
const Course = require("./models/CourseModel");
const connectDB = require("./config/db");

const brandingCourse = {
  title: "Branding Yourself in Freelancing",
  description: `In today's competitive freelance market, your brand is your most powerful asset. As a new freelancer, your ability to attract clients depends on more than just your technical skills, it requires building a brand identity that is visible, memorable, and trusted. This course teaches you how to apply five proven principles of contagious content to your freelance services and marketing strategies:

- Social Currency: Learn how to make your freelance brand shareable by creating content that elevates your client's status and makes them feel connected.
- Triggers: Discover how to link your services to everyday cues so potential clients think of you when they need help.
- Emotion: Understand how to evoke emotions like trust, excitement, or relief in your work to build stronger client relationships.
- Practical Value: Position yourself as a go-to resource by creating listings that solve real problems for your target audience.
- Storytelling: Master storytelling techniques in your work and to communicate your unique value with client success stories.

By the end of this course, you'll have a personalized branding toolkit that includes a clear brand identity, a content strategy, and practical examples of how to use these principles to market your freelance services effectively.`,
  
  duration: "8 weeks",
  estimatedMinutes: 2880, // 8 weeks * 6 hours/week * 60 minutes
  difficulty: "Beginner",
  category: "Marketing",
  thumbnail: "",
  isLiteVersion: false,

  instructor: {
    name: "UniFreelancer Academy",
    title: "Expert Instructors",
    bio: "Learn from industry professionals and marketing experts who specialize in freelance branding and digital marketing strategies.",
    avatar: ""
  },

  pricing: {
    amount: 0,
    currency: "USD",
    type: "one-time"
  },

  subscription: {
    isSubscriptionCourse: false,
    tier: ""
  },

  learningPoints: [
    "Define and apply the concept of social currency to make your brand and content more shareable",
    "Develop a clear and compelling brand identity that aligns with your values and audience needs",
    "Use psychological triggers and emotional appeal to make your brand memorable",
    "Create content that delivers practical value and positions you as a trusted expert",
    "Master storytelling techniques to communicate your unique value and attract clients",
    "Build a personalized branding toolkit with a content strategy and practical examples"
  ],

  modules: [
    {
      title: "Brand Identity and Social Currency",
      description: `This module focuses on building a strong brand identity and leveraging social currency to create content that resonates and spreads. Learners will explore how personal and business brands can craft authentic identities, develop shareable content, and use psychological triggers to foster engagement. Drawing on Berger's concept of social currency and principles of content marketing, this module provides practical strategies for freelancers and businesses to stand out, build trust, and encourage audience-driven amplification in a competitive digital landscape.`,
      
      learningPoints: [
        "Define and apply the concept of social currency to make your brand and content more shareable and conversation-worthy",
        "Develop a clear and compelling brand identity that aligns with your values, audience needs, and market positioning",
        "Analyze and implement content marketing strategies that strengthen brand identity and drive engagement",
        "Design social currency-driven tactics that encourage audience participation and organic reach",
        "Evaluate challenges and opportunities in brand building using insights from psychology, consumer behavior, and digital trends"
      ],
      
      articleContent: `## Learning Materials

### Readings:
- Berger, J. (2013). *Contagious: why things catch on* (First Simon & Schuster hardcover edition.). Simon & Schuster. - Chapter 1: Social Currency
- Mishra, S. (2020). *Digital marketing guide for start-up entrepreneurs* (1st ed.). Business Expert Press. - Chapter 3: Content Marketing Strategy
- Curtis, N. (2024). *Why Branding Identity is More Important Than Ever*. Forbes.
- YEC. (2020). *The Importance of Social Currency*. Forbes.

### Podcast:
- https://podcasts.apple.com/us/podcast/the-q-a-episode/id1355941022?i=1000698593193

### Videos:
- https://youtu.be/4eIDBV4Mpek
- https://youtu.be/s2eka_dWAxs
- https://youtu.be/icwWpAHReWg

## Assignment: Building Your Brand Identity & Social Currency Strategy

This assignment will help you apply the principles of brand identity and social currency to create a strong, shareable presence in the digital space. You will define your brand, analyze competitors, and design strategies that make your content contagious and conversation-worthy.

### Part 1: Define Your Brand Identity
Create a detailed description of your brand that includes your skills, services, unique strengths, target audience, brand personality and tone, mission and vision, and visual identity concept.

### Part 2: Competitor Analysis (3 examples)
Research three freelancers or small businesses in your niche. Summarize their brand identity, identify what makes them successful, and highlight gaps or opportunities you can leverage.

### Part 3: Social Currency Strategy
Design two actionable strategies to make your brand shareable and engaging using Berger's concept of social currency (e.g., Insider Access, Identity Signaling, Conversation Starters, Status Boost).

### Part 4: Reflection
Reflect on how your brand identity and social currency strategies work together to build trust, engagement, and visibility.

**Grading Criteria (30 points):** Brand Identity Summary (8 pts), Competitor Analysis (6 pts), Social Currency Strategy (8 pts), Reflection (4 pts), Visual Elements (4 pts)`,
      
      videoUrl: "https://youtu.be/4eIDBV4Mpek",
      duration: "2 weeks",
      estimatedMinutes: 720,
      order: 1
    },
    {
      title: "Catching Attention with Triggers and Emotion for Freelancers",
      description: `As a freelancer, standing out in a crowded digital marketplace requires more than showcasing your skills. It demands creating content that captures attention and sticks in your audience's mind. This module teaches freelancers how to use psychological triggers and emotional appeal to make their personal brand memorable and shareable. You'll learn how everyday cues can keep your services top-of-mind and how emotions like awe, humor, or inspiration can drive engagement and referrals. By applying these principles, you'll design content that not only attracts clients but also builds trust and visibility.`,
      
      learningPoints: [
        "Identify triggers that keep your freelance brand relevant and top-of-mind for potential clients",
        "Select and apply emotional drivers that resonate with your target audience and encourage sharing",
        "Analyze examples of freelancers who successfully use triggers and emotion in their branding",
        "Create a content concept that integrates triggers and emotional appeal to promote your freelance services effectively"
      ],
      
      articleContent: `## Learning Materials

### Readings:
- Berger, J. (2013). *Contagious: why things catch on* - Chapter 2: Triggers, Chapter 3: Emotion
- Alvarez-Monzoncillo, J. M. (2023). *Dynamics of Influencer Marketing: A Multidisciplinary Approach* - Chapter 2: The marketing of UGC, media industries and business influence
- Expert Panel. (2023). *Launching A Branded Blog? Here are 15 Tips From Agency Pros*. Forbes.

### Podcast:
- https://podcasts.apple.com/us/podcast/using-emotional-triggers-to-create-magnetic-marketing/id1378772801?i=1000700636993

### Videos:
- https://youtu.be/iONQNwRHd7Y
- https://youtu.be/83ydSHaFVhE?si=sIBx1TBHJg7WKwV1

## Assignment: Design a Freelance Brand Post Using Triggers and Emotion

This assignment will help you apply triggers and emotional appeal to create a piece of content that captures attention, builds connection, and encourages sharing.

### Part 1: Trigger Identification
Choose a specific trigger that will remind potential clients of your services (e.g., tax season for accountants, wedding season for photographers, daily routines for virtual assistants). Explain why this trigger is relevant to your audience.

### Part 2: Emotional Appeal
Select one emotion (e.g., trust, excitement, humor, relief) that you want your content to evoke. Describe how this emotion aligns with your freelance brand.

### Part 3: Content Concept
Create a mockup or description of your content idea (e.g., Instagram post, LinkedIn update, short video concept). Show how the trigger and emotion work together.

### Part 4: Reflection
Reflect on how this approach can help you attract clients and differentiate your freelance brand.

**Grading Criteria (30 points):** Trigger Identification (8 pts), Emotional Appeal Explanation (8 pts), Content Concept (8 pts), Reflection (6 pts)`,
      
      videoUrl: "https://youtu.be/iONQNwRHd7Y",
      duration: "2 weeks",
      estimatedMinutes: 720,
      order: 2
    },
    {
      title: "Become Visible with Practical Value",
      description: `As a new freelancer, one of your biggest challenges is getting noticed and building credibility in a competitive market. The most effective way to do this is by offering practical value, work that solves real problems for your target audience. This module teaches you how to identify client pain points, create helpful resources, and share actionable tips that position you as a trusted expert. By consistently delivering practical value, you'll attract attention, build trust, and encourage referrals without relying on paid ads or aggressive self-promotion.`,
      
      learningPoints: [
        "Define practical value and explain why it is essential for new freelancers to gain visibility",
        "Identify your target audience's pain points and turn them into useful, shareable content ideas",
        "Analyze examples of freelancers who successfully use practical value to grow their brand and client base",
        "Create a content concept that demonstrates practical value and encourages engagement and sharing"
      ],
      
      articleContent: `## Learning Materials

### Readings:
- Berger, J. (2013). *Contagious: why things catch on* - Chapter 4: Public, Chapter 5: Practical Value
- Jenkins, H., Ford, S., & Green, J. (2013). *Spreadable media: creating value and meaning in a networked culture*. New York University Press. - Introduction: Why Media Spreads

### Podcast:
- https://podcasts.apple.com/us/podcast/the-art-of-value-whispering-podcast-meaningful/id1502412440

### Video:
- https://youtu.be/WPiXFrtsTmU?si=gWNshV100u8XIU3o

## Assignment: Create a Practical Value Content Idea for Your Freelance Brand

This assignment will help you design a content idea that provides real, actionable value to your target audience, increasing visibility and positioning yourself as a go-to resource.

### Part 1: Identify Your Audience & Pain Points
Define your ideal client (e.g., small business owners, busy professionals, content creators). List two common challenges or questions they face related to your freelance services. Explain why solving these problems will help you stand out.

### Part 2: Practical Value Concept
Develop one content idea that delivers practical value (e.g., a quick tip video, a checklist, a how-to guide, a resource list). Describe the format, platform, and why it's the best way to reach your audience.

### Part 3: Visual Mockup or Outline
Create a sample post, infographic, or short video storyboard that illustrates your idea. Include a headline or caption that emphasizes the usefulness of the content.

### Part 4: Reflection
Reflect on how offering practical value can help you attract clients and build credibility as a new freelancer.

**Grading Criteria (30 points):** Audience & Pain Points (8 pts), Practical Value Concept (8 pts), Visual Mockup or Outline (8 pts), Reflection (6 pts)`,
      
      videoUrl: "https://youtu.be/WPiXFrtsTmU?si=gWNshV100u8XIU3o",
      duration: "2 weeks",
      estimatedMinutes: 720,
      order: 3
    },
    {
      title: "Master Storytelling to Hook Your Client",
      description: `As a new freelancer, your ability to tell a compelling story can set you apart from competitors and help you connect with potential clients on a deeper level. Storytelling isn't just for writers, it's a powerful marketing tool that builds trust, conveys value, and makes your brand memorable. This module teaches you how to craft authentic stories that highlight your expertise, showcase client success, and communicate your unique approach. By mastering storytelling, you'll learn how to turn your services into narratives that resonate and inspire action.`,
      
      learningPoints: [
        "Explain the role of storytelling in building trust and attracting clients as a freelancer",
        "Identify key elements of an effective brand story (character, conflict, resolution, emotional appeal)",
        "Analyze examples of freelancers who use storytelling successfully to grow their business",
        "Create a brand story or client-focused narrative that hooks potential clients and demonstrates your value"
      ],
      
      articleContent: `## Learning Materials

### Readings:
- Berger, J. (2013). *Contagious: why things catch on* - Chapter 6: Stories
- Grayson, R. (2023). *Foundations in Digital Marketing*. BCcampus. - Part 1: Fundamentals of Digital Marketing. Chapter 2: Fundamentals of Storytelling. Chapter 3: Visual Storytelling.
- Creek, J. (2021). *Like, comment, share, buy: the beginner's guide to marketing your business with video storytelling*. Wiley. - Part I: Videology The study of video and human behaviour, Chapter 1: The Struggle for attention

### Podcast:
- https://podcasts.apple.com/us/podcast/ep-37-the-la-times-strategy-for-impactful-branded-content/id1458778450?i=1000677485445

### Videos:
- https://youtu.be/Nj-hdQMa3uA
- https://youtu.be/0zmIAhEI09A

## Assignment: Craft Your Freelance Brand Story to Hook Clients

This assignment will help you create a compelling brand story that communicates your value, builds trust, and attracts clients.

### Part 1: Define Your Story Framework
Identify the main character (you as the freelancer). Define the conflict/problem your clients face. Describe the resolution—how your services solve that problem. Include an emotional hook (e.g., relief, confidence, excitement).

### Part 2: Write Your Brand Story
Craft a narrative that introduces you, highlights your expertise, and shows how you help clients succeed. Make it conversational and authentic—avoid jargon and focus on connection. End with a call-to-action.

### Part 3: Visual Concept
Create a mockup or outline for how you would share this story (e.g., Instagram carousel, LinkedIn post, short video script). Include visuals or design ideas that reinforce your story's tone and message.

### Part 4: Reflection
Reflect on how storytelling can help you stand out and build trust as a new freelancer.

**Grading Criteria (30 points):** Story Framework (8 pts), Written Brand Story (8 pts), Visual Concept (8 pts), Reflection (6 pts)`,
      
      videoUrl: "https://youtu.be/Nj-hdQMa3uA",
      duration: "2 weeks",
      estimatedMinutes: 720,
      order: 4
    }
  ]
};

async function seedCourse() {
  try {
    console.log("Connecting to database...");
    await connectDB();
    console.log("Connected to MongoDB");

    // Check if course already exists
    const existingCourse = await Course.findOne({ title: brandingCourse.title });
    if (existingCourse) {
      console.log(`Course "${brandingCourse.title}" already exists. Skipping...`);
      console.log(`Existing course ID: ${existingCourse._id}`);
      process.exit(0);
    }

    // Create the course
    console.log("Creating course...");
    const course = new Course(brandingCourse);
    const savedCourse = await course.save();
    
    console.log("\n✅ Course created successfully!");
    console.log(`\nCourse ID: ${savedCourse._id}`);
    console.log(`Title: ${savedCourse.title}`);
    console.log(`Modules: ${savedCourse.modules.length}`);
    console.log(`\nYou can now view this course at: http://localhost:3000/academy/courses/${savedCourse._id}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding course:", error);
    process.exit(1);
  }
}

// Run the seed function
seedCourse();

