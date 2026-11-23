/** Standalone and safe local categorizer, not connected to any mailbox. */
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const knowledge=JSON.parse(readFileSync(resolve(root,'knowledge/venue-facts.json'),'utf8'));
export function triageInquiry(message){
 const text=String(message||'').toLowerCase();
 let kind='general';
 if(/cancel|refund|dispute|chargeback|emergency|injur|unsafe|legal|complain|accessib|allerg|wheelchair/.test(text))kind='escalation';
 else if(/available|availability|date|calendar|booked|vacant|reserve|reschedule|\b(january|february|march|april|may|june|july|august|september|october|november|december|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/.test(text))kind='availability';
 else if(/price|cost|fee|deposit|discount|quote|package|payment/.test(text))kind='pricing';
 else if(/tour|visit|walkthrough|see the venue|appointment/.test(text))kind='tour';
 else if(/cabin|stay|sleep|airbnb|hot tub|glamping/.test(text))kind='lodging';
 const safety=['availability','pricing','escalation'].includes(kind)?'owner-review-required':'review-before-send';
 return {kind,safety,autoSend:false,reason:'No verified mailbox or owner-approved sending policy has been configured.'};
}
export function getPublicFact(id){return knowledge.facts.find(f=>f.id===id)||null}
export function getApprovedEmailFact(id){const fact=getPublicFact(id);return fact?.approvedForEmail===true&&fact.status==='owner-approved'?fact:null}
export function proposeDraft(message){
 const result=triageInquiry(message);
 const content={
  tour:'Thanks for reaching out about Horsehead Lake Lodge. You can request a tour using the link on our website. We can also help answer questions about the venue.',
  lodging:'Thanks for your interest in staying at Horsehead Lake Lodge. Our website lists the available cabin types and their individual booking links. Please check the listing for current availability and exact terms.',
  pricing:'Thanks for reaching out. Package pricing depends on the type and details of your event. We can help get your questions to the venue team for a current quote.',
  availability:'Thanks for considering Horsehead Lake Lodge. Please share your preferred dates and event type so the team can confirm current availability.',
  escalation:'Thanks for letting us know. I am passing this to the venue team for personal follow-up.',
  general:'Thanks for reaching out to Horsehead Lake Lodge. Could you tell us a little more about what you are planning?'
 }[result.kind];
 return {...result,draft:content,requiresApproval:true};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const input=process.argv.slice(2).join(' ');if(!input){console.error('Usage: node scripts/concierge-triage.mjs "your test inquiry"');process.exit(2)}
 console.log(JSON.stringify(proposeDraft(input),null,2));
}
