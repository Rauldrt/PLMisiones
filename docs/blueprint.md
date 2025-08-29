# **App Name**: Libertario Misiones Web

## Core Features:

- News Feed: Displays a feed of news articles fetched from `news.json`, with an admin interface to modify these files.
- Dynamic Forms: Renders web forms with fields dynamically generated from definitions stored in JSON, handling submission via form-submissions-*.json files.
- AI News Generation Tool: Uses Genkit and a Google LLM to generate news content from URLs provided in the admin interface.
- Homepage Carousel: Displays a carousel of images and messages configured via a `banner.json` data file.
- Admin Authentication: Firebase Authentication integration to manage access to the admin panel.
- Content Management: Admin panel to modify all the JSON files content in `src/data`.

## Style Guidelines:

- Primary color: Cyan (#00B5E2) for main buttons and interactive elements.
- Background color: Dark purple (#45698C) to set a modern tone.
- Accent color: Yellow-Orange (#FFB549) used sparingly for notifications and important alerts.
- Headline font: 'Poppins' (sans-serif) for impactful and modern titles. 
- Body font: 'PT Sans' (sans-serif) for readable and friendly body text. 
- Use simple and clear icons from ShadCN/UI for navigation and key actions.
- Maintain a clean and accessible layout using Tailwind CSS for spacing and responsiveness.