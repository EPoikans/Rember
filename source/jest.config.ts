
import type {Config} from 'jest';

export default async (): Promise<Config> => {
  return {
	testMatch: [
		"**/__tests__/**/*.([mc])?[jt]s?(x)",
		"**/?(*.)+(spec|test).([mc])?[jt]s?(x)" ],
	testPathIgnorePatterns: [
		"/node_modules/",
		"/electron/",
	],
  };
};