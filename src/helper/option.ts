const w:number=window.innerWidth;
const h:number=window.innerHeight;

const ratio:number=w/h;
const fov:number=75;
const near:number=0.1;
const far:number=10;

export const mainOptions = {
  w: w,
  h: h,
  ratio: ratio,
  fov: fov,
  near: near,
  far: far
};