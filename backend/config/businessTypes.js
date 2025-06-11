// backend/config/businessTypes.js
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const data = JSON.parse(
  readFileSync(join(__dirname, '../utils/uniqueFieldsOutput.json'), 'utf-8')
);

export const BUSINESS_TYPES = [...new Set(data.applicantTypes)];