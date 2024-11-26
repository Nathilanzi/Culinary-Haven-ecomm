const Ajv = require("ajv");
const fs = require("fs");

// JSON schema for validating the manifest file
const manifestSchema = {
  type: "object",
  required: ["name", "short_name", "start_url", "display", "icons"],
  properties: {
    name: { type: "string" },
    short_name: { type: "string" },
    start_url: { type: "string" },
    display: { type: "string", enum: ["fullscreen", "standalone", "minimal-ui", "browser"] },
    icons: {
      type: "array",
      items: {
        type: "object",
        required: ["src", "sizes", "type"],
        properties: {
          src: { type: "string" },
          sizes: { type: "string", pattern: "^[0-9]+x[0-9]+$" },
          type: { type: "string" }
        }
      }
    },
    background_color: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
    theme_color: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
    orientation: { type: "string", enum: ["portrait", "landscape"] },
    description: { type: "string" },
    shortcuts: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "short_name", "description", "url"],
        properties: {
          name: { type: "string" },
          short_name: { type: "string" },
          description: { type: "string" },
          url: { type: "string" },
          icons: {
            type: "array",
            items: {
              type: "object",
              required: ["src", "sizes"],
              properties: {
                src: { type: "string" },
                sizes: { type: "string", pattern: "^[0-9]+x[0-9]+$" }
              }
            }
          }
        }
      }
    }
  }
};

// Main validation function
const validateManifest = (filePath) => {
  const ajv = new Ajv();
  const validate = ajv.compile(manifestSchema);

  try {
    const manifest = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const valid = validate(manifest);
    if (valid) {
      console.log("Manifest is valid!");
    } else {
      console.error("Manifest validation failed:", validate.errors);
    }
  } catch (error) {
    console.error(`Error reading or parsing the manifest file: ${error.message}`);
  }
};

// Get file name from command-line arguments or use default
const filePath = process.argv[2] || "./manifest.json";

// Run the validation
validateManifest(filePath);
