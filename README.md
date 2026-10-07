# Cloud resume - Azure Static Web Apps

A hands-on project documenting how I built a technical resume with HTML and CSS and configured its deployment to Microsoft Azure Static Web Apps through GitHub Actions.

This repository contains the website source and the troubleshooting record behind it. The purpose is to show the path from a locally edited webpage to a cloud deployment, including the mistakes, fixes, and lessons learned along the way.

## Project overview

The application is a static resume page for Andrew Stephens. It presents a professional summary, technical experience, recent professional experience, skills, certifications, education, and contact information. CSS provides a blue gradient background, a centered white resume container, typography, and a circular profile photo.

The project connects front-end development with practical cloud operations: source control, deployment configuration, repository secrets, and troubleshooting across browser and hosting layers. It is part of my work developing systems administration and cloud engineering skills.

## Objectives

- Translate a traditional resume into structured HTML.
- Use CSS to control layout, spacing, typography, and presentation.
- Experiment with JavaScript, browser storage, and API requests.
- Keep source code and development notes in GitHub.
- Configure automated deployment to Azure Static Web Apps.
- Document symptoms, causes, and fixes so the learning process is reproducible.

## Architecture and current scope

| Layer | Implementation |
| --- | --- |
| Browser | Static HTML and CSS, with a local profile image |
| External presentation dependencies | Google Fonts and Font Awesome |
| Source control | GitHub repository, with deployment triggered from `main` |
| Deployment automation | GitHub Actions using `Azure/static-web-apps-deploy@v1` |
| Hosting target | Azure Static Web Apps |
| Backend | No API source directory or Azure backend defined in this repository |

The repository configures the deployment path. The latest Actions run and the Azure resource must be checked separately to confirm deployment health.

JavaScript experiments are retained in the source, but the current page does not activate them:

- `index.js` contains a third-party CountAPI visitor counter. Its script reference and counter markup are commented out in `index.html`.
- `spoiler.js` contains click and keyboard handlers for a reveal interaction. The file is not loaded by the page; a similar inline script is also commented out.
- The counter is not an Azure Functions or database-backed implementation.

## Repository structure

| Path | Purpose |
| --- | --- |
| [index.html](index.html) | Resume content, sections, metadata, and stylesheet references |
| [style.css](style.css) | Screen layout, typography, colors, and profile image styling |
| [profile.jpg](profile.jpg) | Local profile photo |
| [index.js](index.js) | Inactive visitor counter experiment using `fetch()` and `localStorage` |
| [spoiler.js](spoiler.js) | Inactive click-to-reveal experiment |
| [DEV-JOURNAL.md](DEV-JOURNAL.md) | Development issues, recorded fixes, and lessons |
| [.github/workflows/azure-static-web-apps-salmon-hill-092a47b0f.yml](.github/workflows/azure-static-web-apps-salmon-hill-092a47b0f.yml) | Azure deployment and pull request environment cleanup |
| [README.md](README.md) | Project purpose, workflow, current scope, and next steps |

There is no package manifest or framework build pipeline. The application files live at the repository root.

## Development process

### Building the HTML resume

The first step was translating resume content into headings, paragraphs, sections, and bullet lists. This made document structure a coding concern: incorrect nesting and missing closing tags could affect how the browser interpreted later content.

The development journal records an early rendering issue involving unclosed tags. Inspecting the browser's parsed DOM helped distinguish markup problems from missing text.

### Styling the page

CSS controls the resume container, background, heading rules, and text colors. Layout debugging introduced the difference between a fixed viewport height and a minimum height that allows a long document to grow.

The current stylesheet uses `min-height: 100vh`. It also applies the same text color to `p` and `li`, addressing the inconsistent section colors recorded in the journal.

### Experimenting with JavaScript

The visitor counter exercise introduced asynchronous requests, JSON responses, DOM updates, and browser storage. The spoiler exercise introduced event listeners and class toggling, including Enter and Space key handling.

These experiments remain inactive in the current HTML. Re-enabling them requires reviewing the markup, selectors, and error handling. For example, the counter script selects every `span` on the page, while its commented markup supplies five digits and the script pads values to six. It needs a dedicated counter selector and matching digit elements before activation.

The `localStorage` flag records a visit for a particular browser storage context. It does not identify unique people across devices or browsers.

### Connecting source control to Azure

The GitHub Actions workflow checks out the repository and invokes the Azure deployment action. Application updates pushed to `main` use the same configured deployment path, removing the need to manually upload each changed file.

The workflow keeps its deployment token in a repository secret. The YAML references the secret by name; it does not contain the token value.

## Azure deployment workflow

The [workflow file](.github/workflows/azure-static-web-apps-salmon-hill-092a47b0f.yml) runs on:

- Pushes to `main`.
- Pull requests targeting `main` when opened, synchronized, reopened, or closed.

For a push or a non-closed pull request, an Ubuntu runner checks out the source with `actions/checkout@v4` and runs `Azure/static-web-apps-deploy@v1` with `action: "upload"`.

The source paths are configured as follows:

```yaml
app_location: "/"
api_location: ""
output_location: ""
```

| Setting | Meaning in this project |
| --- | --- |
| `app_location: "/"` | Application source is at the repository root |
| `api_location: ""` | No API source directory is configured |
| `output_location: ""` | No separate build output directory is specified |

The upload step references `AZURE_STATIC_WEB_APPS_API_TOKEN_SALMON_HILL_092A47B0F` from GitHub repository secrets and uses `GITHUB_TOKEN` for GitHub integration.

A separate job handles closed pull requests by invoking the Azure action with `action: "close"` to close the associated preview environment.

To deploy a fork, create your own Azure Static Web App, connect your repository and branch, and configure the deployment credential and workflow for that resource. Copying this repository does not copy its secrets or Azure resource.

## Run locally

Clone the repository:

```bash
git clone https://github.com/astephens-cloud/Cloud-Resume-Azure-Infrastructure.git
cd Cloud-Resume-Azure-Infrastructure
```

From the repository directory, start a local server with Python 3:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000) in a browser. Stop the server with Ctrl+C.

No dependency installation is required. Google Fonts and Font Awesome need internet access to load their external resources.

## Troubleshooting and lessons learned

The [development journal](DEV-JOURNAL.md) preserves five recorded debugging exercises.

| Issue | Recorded diagnosis and lesson |
| --- | --- |
| Resume content did not render as expected | Unclosed and incorrectly nested HTML tags changed the parsed document structure; inspect the DOM and validate markup |
| Content near the top was clipped | Missing CSS braces and a fixed-height flex layout complicated rendering; check syntax and allow the document to grow |
| Clicking redacted text had no effect | CSS defined visual states but the JavaScript handlers were missing |
| Printing added blank pages | The recorded fix changed the print layout and removed trailing spacing |
| Some sections had darker text | Paragraph color rules did not select list items; check selectors and inherited styles |

The journal describes earlier development states. Some recorded fixes, including print styles and spoiler interactions, are not active in the current source. It also references `style-2.css`, a filename from that earlier work that is not present in this repository.

Working through these issues reinforced a practical debugging sequence: check the document structure, inspect computed styles, confirm the required scripts load, and then investigate external services or deployment behavior.

## Skills practiced

| Area | Practical work |
| --- | --- |
| Front-end development | HTML structure, CSS layout and selectors, JavaScript event handlers |
| Cloud deployment | Azure Static Web Apps configuration |
| Automation | GitHub Actions triggers, upload jobs, and preview cleanup |
| Source control | GitHub-hosted application files and workflow configuration |
| Credential handling | Deployment-token references through repository secrets |
| Troubleshooting | DOM inspection, layout diagnosis, and print behavior |
| Documentation | Markdown and symptom-to-resolution development notes |

## Current status and next steps

The repository contains the static resume, screen styling, deployment workflow, and development journal. It does not yet contain Infrastructure as Code, an Azure-native counter backend, telemetry configuration, or automated validation.

Potential follow-up work:

- Validate HTML nesting and check accessibility, including keyboard navigation and image descriptions.
- Verify small-screen behavior and add print rules to the current stylesheet.
- Repair and test JavaScript experiments before loading them in the page.
- Document the verified live URL, custom domain, DNS, and HTTPS configuration.
- Add an Azure Functions API and persistent storage if visitor tracking becomes a project requirement.
- Define Azure resources with Terraform or Bicep and add validation to GitHub Actions.

These are proposed extensions, not completed features.
