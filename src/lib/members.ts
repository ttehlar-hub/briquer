/** Add family members here to give them the same three-section starting setup. */
export const familyMembers = [
  { id: 'tibor', name: 'Tibor', initial: 'T', tone: 'sage' },
  { id: 'janka', name: 'Janka', initial: 'J', tone: 'clay' },
] as const

export type FamilyMember = (typeof familyMembers)[number]
export type MemberId = FamilyMember['id']

export function getFamilyMember(id: string | undefined) {
  return familyMembers.find((member) => member.id === id)
}
