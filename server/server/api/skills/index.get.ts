import { readSkillsIndex } from '../../utils/skills'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async () => {
  return await readSkillsIndex()
})
