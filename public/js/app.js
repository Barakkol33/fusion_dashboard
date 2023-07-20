// app.js
const axios = require('axios');
const jsyaml = require('js-yaml');

const jobQueuesContainer = document.querySelector(".job-queues");

// Updated createJobQueue function with separate elements for server header and job queue container
function createJobQueue(serverName, serverUrl) {
    const jobQueueContainer = document.createElement("div");
    jobQueueContainer.classList.add("queue-container");
  
    const queueHeader = document.createElement("h3");
    queueHeader.textContent = serverName;
    jobQueueContainer.appendChild(queueHeader);
  
    const jobQueue = document.createElement("div");
    jobQueue.classList.add("job-queue"); // Add a class to identify job queue elements
    jobQueueContainer.appendChild(jobQueue);
  
    jobQueuesContainer.appendChild(jobQueueContainer);
  }
  
  
// Updated animateQueue function to use setInterval for job updates every 2 seconds
async function animateQueue(serverName, serverUrl) {
    const jobQueueContainer = document.querySelector(".job-queues .queue-container:last-child");
    if (!jobQueueContainer) return;
  
    try {
      const response = await axios.get(serverUrl);
      if (response.status === 200) {
        const jobQueue = jobQueueContainer.querySelector(".job-queue"); // Find the job queue element
        await updateQueue(jobQueue, serverUrl);
  
        setInterval(async () => {
          await updateQueue(jobQueue, serverUrl); // Update the job queue every 2 seconds
        }, 2000); // 2000 milliseconds = 2 seconds
      } else {
        console.error(`Server ${serverName} is not reachable.`);
        const jobQueue = jobQueueContainer.querySelector(".job-queue"); // Find the job queue element
        jobQueue.innerHTML = ""; // Clear the queue content
        const placeholder = document.createElement("div");
        placeholder.textContent = "Server is not reachable"; // Display an error message or add a placeholder
        placeholder.classList.add("job");
        jobQueue.appendChild(placeholder);
      }
    } catch (error) {
      console.error(`Error fetching jobs from server ${serverName}:`, error.message);
      const jobQueue = jobQueueContainer.querySelector(".job-queue"); // Find the job queue element
      jobQueue.innerHTML = ""; // Clear the queue content
      const placeholder = document.createElement("div");
      placeholder.textContent = "Error fetching jobs"; // Display an error message or add a placeholder
      placeholder.classList.add("job");
      jobQueue.appendChild(placeholder);
    }
  }
  
  

async function updateQueue(jobQueue, serverUrl) {
  try {
    const response = await axios.get(serverUrl);
    const jobs = response.data.jobs;

    // Clear previous jobs
    jobQueue.innerHTML = "";

    for (const job of jobs) {
      const jobElement = document.createElement("div");
      jobElement.textContent = job;
      jobElement.classList.add("job");
      jobQueue.appendChild(jobElement);
    }
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to fetch servers from the YAML file
async function fetchServers() {
  try {
    const response = await axios.get('servers.yaml');
    return jsyaml.load(response.data); // Use js-yaml from the global object
  } catch (error) {
    console.error('Error reading servers.yaml:', error.message);
    return []; // Return an empty array in case of an error
  }
}

// Function to start the application
async function startApp() {
  const servers = await fetchServers();
  for (const server of servers) {
    createJobQueue(server.name, server.url);
    animateQueue(server.name, server.url);
  }
}

document.addEventListener('DOMContentLoaded', startApp);
