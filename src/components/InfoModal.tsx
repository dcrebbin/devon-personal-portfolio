import Github from "../icons/Github";
import LinkedIn from "../icons/LinkedIn";
import Email from "../icons/Email";

export default function InfoModal() {
  return (
    <div className="m-14 bg-white w-64 h-fit rounded-l-3xl rounded-tr-3xl p-4 text-2xl z-[100]">
      <div className="flex items-center justify-between">
        <div className="flex">
          <p>Hey!</p>
          <button className="hover:-translate-y-2 cursor-pointer">👋</button>
        </div>
        <div className="flex">
          <a href="mailto:devon@artvuu.group" className="hover:-translate-y-[2px]" target="_blank">
            <Email />
          </a>
          <a href="https://github.com/dcrebbin" className="hover:-translate-y-[2px]" target="_blank">
            <Github />
          </a>
          <a href="https://www.linkedin.com/in/devoncrebbin/" className="hover:-translate-y-[2px]" target="_blank">
            <LinkedIn />
          </a>
        </div>
      </div>
      <p>I'm Devon Crebbin</p>
      <p className="text-sm">Indigenous Software Developer & Designer</p>
    </div>
  );
}
