export enum Icons { Heart = 'heart' };
export enum Size { Tiny = 'tiny' }

const Base64 = {
  [Icons.Heart]: "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iaGVpZ2h0OiA0OHB4OyB3aWR0aDogNDhweDsiPjxkZWZzPjxmaWx0ZXIgaWQ9InNoYWRvdy0yIiBoZWlnaHQ9IjMwMCUiIHdpZHRoPSIzMDAlIiB4PSItMTAwJSIgeT0iLTEwMCUiPjxmZUZsb29kIGZsb29kLWNvbG9yPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDEpIiByZXN1bHQ9ImZsb29kIj48L2ZlRmxvb2Q+PGZlQ29tcG9zaXRlIGluPSJmbG9vZCIgaW4yPSJTb3VyY2VHcmFwaGljIiBvcGVyYXRvcj0iYXRvcCIgcmVzdWx0PSJjb21wb3NpdGUiPjwvZmVDb21wb3NpdGU+PGZlR2F1c3NpYW5CbHVyIGluPSJjb21wb3NpdGUiIHN0ZERldmlhdGlvbj0iMTMiIHJlc3VsdD0iYmx1ciI+PC9mZUdhdXNzaWFuQmx1cj48ZmVPZmZzZXQgZHg9IjAiIGR5PSIwIiByZXN1bHQ9Im9mZnNldCI+PC9mZU9mZnNldD48ZmVDb21wb3NpdGUgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0ib2Zmc2V0IiBvcGVyYXRvcj0ib3ZlciI+PC9mZUNvbXBvc2l0ZT48L2ZpbHRlcj48L2RlZnM+PGcgY2xhc3M9IiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTksMTQpIiBzdHlsZT0idG91Y2gtYWN0aW9uOiBub25lOyI+PHBhdGggZD0iTTQ4MC4yNSAxNTYuMzU1YzAgMTYxLjI0LTIyNC4yNSAzMjQuNDMtMjI0LjI1IDMyNC40M1MzMS43NSAzMTcuNTk1IDMxLjc1IDE1Ni4zNTVjMC05MS40MSA3MC42My0xMjUuMTMgMTA3Ljc3LTEyNS4xMyA3Ny42NSAwIDExNi40OCA2NS43MiAxMTYuNDggNjUuNzJzMzguODMtNjUuNzMgMTE2LjQ4LTY1LjczYzM3LjE0LjAxIDEwNy43NyAzMy43MiAxMDcuNzcgMTI1LjE0eiIgZmlsbD0iIzAwMDAwMCIgZmlsbC1vcGFjaXR5PSIxIj48L3BhdGg+PC9nPjwvc3ZnPg=="
}

interface IconProperties {
  icon: Icons;
  size?: Size;
}

import './icon.scss';
export const Icon = ({ icon, size }: IconProperties) => {

  return (
    <img className={"icon" + (size === Size.Tiny ? " icon--tiny" : "")} src={"data:image/svg+xml;base64, " + Base64[icon]} />
  );
};
