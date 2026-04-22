"use client";
export default function ChangeBackgroundComponent() {

  function changeBodyBG() {
    document.body.classList.toggle("dark");
  }

  return (
    <div  onClick={changeBodyBG}>
      ChangeBackgroundComponent
    </div>
  );
}