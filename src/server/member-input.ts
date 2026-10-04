import { z } from 'zod'
import { familyMembers } from '../lib/members'

// Validate against the same registry as the chooser without shipping Zod in it.
export const memberInputSchema = z.object({
  memberId: z.enum(familyMembers.map((member) => member.id)),
})
