function Footer() {
  return (
    <footer className="bg-[#0B2027] text-[#a9c3c6] mt-20">
      <div className="max-w-6xl text-center mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-[Sora] font-bold text-white text-lg">TicketBooking</p>
          <p className="text-sm mt-3 max-w-xs">
            Your go-to platform for booking tickets to concerts, sports events,
            and festivals across Kenya.
          </p>
        </div>

        <div>
          <p className="font-semibold text-white text-sm uppercase tracking-wide mb-3">
            Quick Links
          </p>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white transition cursor-pointer">Home</li>
            <li className="hover:text-white transition cursor-pointer">Browse Events</li>
            <li className="hover:text-white transition cursor-pointer">My Bookings</li>
          </ul>
        </div>
         <div className="border-t font-semibold border-white/10 text-center  ">
        © 2026 TicketBooking. All rights reserved.
      <p className="mt-2 md:mt-0">
            Made with ❤️ in Kenya
          </p>
        </div>
      </div>
     
    </footer>
  );
}


export default Footer;