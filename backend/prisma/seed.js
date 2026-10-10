const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const now = new Date();
  
  // Create Hackathon Config
  await prisma.hackathonConfig.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      hackathonName: "DevOps Hackathon 2026",
      registrationStart: new Date(now.getTime() - 1000 * 60 * 60 * 24), // started yesterday
      registrationEnd: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7), // ends in 7 days
      hackathonStart: new Date(now.getTime() - 1000 * 60), // started 1 min ago so problems are unlocked
      hackathonEnd: new Date(now.getTime() + 1000 * 60 * 60 * 48), // ends in 48 hours
      maxTeams: 50
    }
  });

  // Create Problem Statements
  const problems = [
    {
      title: "Automated CI/CD Pipeline Security Auditor",
      description: "Build an automated tool that scans CI/CD pipelines (Jenkins, GitHub Actions, GitLab CI) for security misconfigurations, hardcoded secrets, and vulnerable base images in Dockerfiles. The solution should automatically block deployments if a critical vulnerability is found.",
      domain: "DevOps / Cloud Security",
      difficulty: "Advanced"
    },
    {
      title: "Container Deployment Monitoring Platform",
      description: "Develop a centralized monitoring dashboard that tracks the health, CPU, and memory usage of multiple Kubernetes clusters in real-time. It should automatically scale deployments based on traffic spikes and alert the team via Slack.",
      domain: "Docker / Kubernetes / Monitoring",
      difficulty: "Intermediate"
    },
    {
      title: "Zero-Downtime Database Migration Pipeline",
      description: "Design a fully automated, zero-downtime database schema migration pipeline using Terraform and GitHub Actions. The pipeline must support automatic rollbacks in case a deployment fails, ensuring the application remains available throughout the process.",
      domain: "Automation / Databases",
      difficulty: "Advanced"
    },
    {
      title: "AI-Powered Infrastructure as Code Generator",
      description: "Create an application that takes natural language requirements from a developer and automatically generates valid, secure Terraform or CloudFormation templates to provision the requested AWS infrastructure.",
      domain: "AI / Cloud / IaC",
      difficulty: "Expert"
    },
    {
      title: "Serverless Cost Optimization Engine",
      description: "Build a tool that analyzes AWS Lambda usage patterns and recommends optimal memory allocations and timeout settings to minimize cost without impacting performance. Implement an automated way to apply these recommendations.",
      domain: "AWS / Serverless / FinOps",
      difficulty: "Intermediate"
    },
    {
      title: "Multi-Cloud Disaster Recovery Automator",
      description: "Develop a pipeline that automatically synchronizes critical application state from AWS to Azure. In the event of an AWS region failure, the tool should automatically failover DNS and spin up the required infrastructure in Azure.",
      domain: "Multi-Cloud / High Availability",
      difficulty: "Expert"
    }
  ];

  for (const problem of problems) {
    // Only create if it doesn't exist to avoid duplicates on re-run
    const existing = await prisma.problemStatement.findFirst({
      where: { title: problem.title }
    });
    if (!existing) {
      await prisma.problemStatement.create({
        data: problem
      });
    }
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
