import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Best Credit Cards for Food Delivery in 2026: Maximize DoorDash, Uber Eats & Grubhub Rewards | Eddy',
  description: 'Compare credit card rewards for food delivery orders. Chase Sapphire, Amex Gold, Capital One Savor — see which card saves you the most on DoorDash, Uber Eats, and Grubhub.',
  openGraph: {
    title: 'Best Credit Cards for Food Delivery in 2026',
    description: 'Compare rewards across Chase, Amex, Capital One and more for delivery orders.',
    type: 'article',
    publishedTime: '2026-02-28T00:00:00Z',
  },
};

export default function CreditCardFoodDeliveryRewards() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            <span className="text-xl font-black text-black">Eddy</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/blog" className="hover:text-black">Blog</Link>
            <Link href="/restaurants" className="hover:text-black">Restaurants</Link>
          </nav>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-16">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/blog" className="hover:text-black">← Blog</Link>
            <span>·</span>
            <time dateTime="2026-02-28">February 28, 2026</time>
            <span>·</span>
            <span>10 min read</span>
          </div>
          <h1 className="text-4xl font-black text-black mb-4 leading-tight">
            Best Credit Cards for Food Delivery in 2026: Maximize Your DoorDash, Uber Eats &amp; Grubhub Rewards
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed">
            The right credit card can save you $300-800 per year on food delivery — between cashback, monthly credits, and membership perks. Here&apos;s the complete breakdown.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>Why Your Card Choice Matters More Than You Think</h2>
          <p>
            The average American household spends <strong>$3,400 per year on food delivery</strong> according to Lending Tree&apos;s 2025 survey. At 1% cashback, that&apos;s $34 back. At 4-5% with the right card, it&apos;s $136-170. Add monthly credits and membership savings, and you&apos;re looking at $500+ per year in savings — just by swiping a different card.
          </p>

          <h2>The Top Cards Ranked by Delivery Savings</h2>

          <h3>🥇 Chase Sapphire Reserve — Best Overall</h3>
          <ul>
            <li><strong>Dining reward:</strong> 3x points (4.5% value when redeemed through Chase Travel)</li>
            <li><strong>Monthly DoorDash credit:</strong> $5/month ($60/year) with complimentary DashPass</li>
            <li><strong>Annual fee:</strong> $550 (offset by $300 travel credit + DoorDash perks)</li>
            <li><strong>Annual delivery savings on $3,400 spend:</strong> ~$213 (points + credits)</li>
          </ul>
          <p>
            The Sapphire Reserve is the king of food delivery cards. The free DashPass alone saves $120/year if you&apos;d otherwise pay for it, plus the $60 in credits and 4.5% effective return on dining. The high annual fee is justified if you also travel.
          </p>

          <h3>🥈 Amex Gold — Best for Restaurants</h3>
          <ul>
            <li><strong>Dining reward:</strong> 4x points (4.8% value with optimal transfer)</li>
            <li><strong>Monthly dining credit:</strong> $10/month at select partners including Grubhub ($120/year)</li>
            <li><strong>Annual fee:</strong> $250</li>
            <li><strong>Annual delivery savings on $3,400 spend:</strong> ~$283 (points + credits)</li>
          </ul>
          <p>
            The Amex Gold actually beats the Sapphire Reserve on pure food delivery math. 4x points at restaurants (including delivery) plus $120 in annual Grubhub credits. Lower annual fee too. The catch: Amex points are less flexible than Chase points for non-travel redemptions.
          </p>

          <h3>🥉 Capital One SavorOne — Best No-Fee Option</h3>
          <ul>
            <li><strong>Dining reward:</strong> 3% unlimited cashback</li>
            <li><strong>Monthly credits:</strong> None</li>
            <li><strong>Annual fee:</strong> $0</li>
            <li><strong>Annual delivery savings on $3,400 spend:</strong> ~$102</li>
          </ul>
          <p>
            No annual fee, 3% back on all dining and delivery, no complicated point systems. If you don&apos;t want to do credit card math, this is the card. Simple and effective.
          </p>

          <h3>Uber Visa Card — Best for Uber Eats Loyalists</h3>
          <ul>
            <li><strong>Uber orders:</strong> 5% back on Uber and Uber Eats</li>
            <li><strong>Other dining:</strong> 3% back</li>
            <li><strong>Annual fee:</strong> $0</li>
            <li><strong>Annual delivery savings (if all Uber Eats):</strong> ~$170</li>
          </ul>
          <p>
            If you exclusively use Uber Eats, this beats everything else. 5% back with no annual fee is exceptional. The downside: it&apos;s only 5% on Uber — DoorDash and Grubhub orders earn the standard 3%.
          </p>

          <h3>DoorDash Rewards Mastercard — Best for DoorDash Loyalists</h3>
          <ul>
            <li><strong>DoorDash orders:</strong> 4% back</li>
            <li><strong>Other dining:</strong> 2% back</li>
            <li><strong>Annual fee:</strong> $0</li>
            <li><strong>Annual delivery savings (if all DoorDash):</strong> ~$136</li>
          </ul>

          <h2>Don&apos;t Forget Membership Stacking</h2>
          <p>
            Cards and memberships compound. Here&apos;s what stacking looks like on a $30 order:
          </p>

          <h3>Example: $30 Uber Eats Order</h3>
          <ul>
            <li><strong>Without optimization:</strong> $30 food + $4.49 delivery + $4.50 service fee + $3 tax + $6 tip = <strong>$47.99</strong></li>
            <li><strong>With Uber One ($9.99/mo):</strong> $30 food + $0 delivery + $3.15 service fee (-30%) + $3 tax + $6 tip - $1.50 (5% order discount) = <strong>$40.65</strong></li>
            <li><strong>With Uber One + Amex Platinum ($15/mo Uber credit):</strong> $40.65 - $15 credit = <strong>$25.65</strong></li>
            <li><strong>Cashback (Uber Visa 5%):</strong> $25.65 - $1.50 = <strong>$24.15 effective cost</strong></li>
          </ul>
          <p>
            That&apos;s <strong>$23.84 in savings</strong> on a single $30 order — nearly 50% off. Multiply by 3-4 orders per week and the math is dramatic.
          </p>

          <div className="bg-blue-50 rounded-2xl p-8 my-8 not-prose">
            <h3 className="text-xl font-bold text-black mb-2">🌊 See Your Real Cost on Every Platform</h3>
            <p className="text-gray-600 mb-4">
              Eddy&apos;s new <strong>Benefits Profile</strong> calculates your true cost across DoorDash, Uber Eats, Grubhub, and direct ordering — factoring in your exact credit cards, memberships, and monthly credits. Set it once, see personalized pricing everywhere.
            </p>
            <Link href="/my-benefits" className="inline-block bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
              Set Up My Benefits →
            </Link>
          </div>

          <h2>The Decision Matrix</h2>
          <ul>
            <li><strong>Spend $200+/month on delivery, travel frequently:</strong> Chase Sapphire Reserve</li>
            <li><strong>Spend $200+/month, want best pure dining rewards:</strong> Amex Gold</li>
            <li><strong>Spend any amount, want simplicity with no fee:</strong> Capital One SavorOne</li>
            <li><strong>Exclusively use one platform:</strong> That platform&apos;s co-branded card (Uber Visa or DoorDash Mastercard)</li>
            <li><strong>Budget-conscious, want maximum savings:</strong> SavorOne + whichever membership you use most (DashPass/Uber One)</li>
          </ul>

          <h2>The Bottom Line</h2>
          <p>
            The combination of the right credit card + a delivery membership + comparing prices across platforms (which is what Eddy does) can cut your effective food delivery cost by 30-50%. Most people optimize none of these. Optimizing all three puts hundreds of dollars back in your pocket annually.
          </p>
          <p>
            <strong>Start with the free wins:</strong> If you&apos;re using a 1% cashback card for delivery, switch to the SavorOne (free, 3% back). Then add your cards to <Link href="/my-benefits" className="text-blue-600 hover:text-blue-800 font-semibold">Eddy&apos;s Benefits Profile</Link> to see exactly what you&apos;re saving on every order.
          </p>
        </div>
      </article>
    </div>
  );
}
