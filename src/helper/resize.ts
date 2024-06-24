
export default function resize(cam:any, ren:any){
    window.addEventListener("resize",function(e){
    const w= window.innerWidth
    const h=window.innerHeight
    cam.aspect=w/h;
    cam.updateProjectionMatrix()
    ren.setSize(w,h);
})
}