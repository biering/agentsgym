import { readSkillsIndex } from "../../utils/skills";

export default defineEventHandler(async () => {
  return await readSkillsIndex();
});

