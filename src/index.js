import { Polygon, SVG } from "@svgdotjs/svg.js";
import * as dat from "dat.gui";
import * as vec2 from "gl-vec2";

class simpleFrustumDrawer {
    constructor(settings) {
        this.bottomRadius = settings.bottomRadius;
        this.topRadius = settings.topRadius;
        this.height = settings.boxHeight;
        this.slits = settings.slitsPerRotation;

        this.cutColor = settings.cutColor;
        this.engraveColor = settings.engraveDeepColor;
    }

    drawBend() {
        // http://www.hampsonlife.com/conecalculator.php
        Math.TAU = 2 * Math.PI;

        const b = this.bottomRadius - this.topRadius;
        const hT = (this.height * this.bottomRadius) / b;
        const rH = Math.sqrt(this.height * this.height + b * b);
        const r = Math.sqrt(hT * hT + this.bottomRadius * this.bottomRadius);
        const c = Math.TAU * this.bottomRadius;
        const cT = Math.TAU * r;
        const alpha = (Math.TAU * c) / cT;

        const inner = draw.circle(2 * rH); //.translate(-r, -r)
        inner.translate(r - rH, r - rH);
        inner.fill("none");
        inner.stroke({ color: this.engraveColor, width: 1 });

        const outer = draw.circle(2 * r); //.translate(-rH, -rH)
        outer.fill("none");
        outer.stroke({ color: this.engraveColor, width: 1 });

        for (let i = 0; i < this.slits; i++) {
            const angle = (alpha * i) / this.slits;

            const innerX = rH * Math.cos(angle);
            const innerY = rH * Math.sin(angle);

            const outerX = r * Math.cos(angle);
            const outerY = r * Math.sin(angle);

            // const c = draw.circle(10)
            // c.translate(-5, -5)
            // c.translate(r, r)
            // c.translate(x, y)
            // c.fill('none')
            // c.stroke({ color: this.engraveColor, width: 1 })
            const l = draw.line(innerX, innerY, outerX, outerY);
            l.translate(r, r);
            l.stroke({ color: this.engraveColor, width: 1 });
        }
    }

    drawLockingJoint(amplitude, width, isRight) {
        let cutArray = [];
        let scoreArray = [];

        for (let y = 0; y < this.height; y += width) {
            // control1_x control1_y control2_x control2_y anchor_x anchor_y
            const halfWidth = width / 2;
            const sidewaysOffset = isRight ? 0 : -halfWidth / 2;

            cutArray.push(sidewaysOffset + amplitude + this.xPosition);
            cutArray.push(y);
            cutArray.push(sidewaysOffset + amplitude + this.xPosition);
            cutArray.push(y + halfWidth);
            cutArray.push(sidewaysOffset + 0 + this.xPosition);
            cutArray.push(y + halfWidth);
            cutArray.push(sidewaysOffset + 0 + this.xPosition);
            cutArray.push(y + width);
            cutArray.push(sidewaysOffset + amplitude + this.xPosition);
            cutArray.push(y + width);

            scoreArray.push(amplitude + this.xPosition);
            scoreArray.push(y);
            scoreArray.push(amplitude + this.xPosition);
            scoreArray.push(y + halfWidth);
            scoreArray.push(-amplitude + this.xPosition);
            scoreArray.push(y + halfWidth);
            scoreArray.push(-amplitude + this.xPosition);
            scoreArray.push(y + width);
            scoreArray.push(amplitude + this.xPosition);
            scoreArray.push(y + width);

            // bezierArray.push("C");
            // bezierArray.push(-1);
            // bezierArray.push(y + taperRatio);
            // bezierArray.push(1);
            // bezierArray.push(y + 1 - taperRatio);
            // bezierArray.push(1);
            // bezierArray.push(y + 1);

            // bezierArray.push("C");
            // bezierArray.push(1);
            // bezierArray.push(y + 1 + taperRatio);
            // bezierArray.push(-1);
            // bezierArray.push(y + 2 - taperRatio);
            // bezierArray.push(-1);
            // bezierArray.push(y + 2);
        }

        let scoreLine = draw.polyline(scoreArray);
        scoreLine.fill("none");
        scoreLine.stroke({ color: this.engraveColor, width: 1 });

        let cutLine = draw.polyline(cutArray);
        cutLine.fill("none");
        cutLine.stroke({ color: this.cutColor, width: 1 });
    }

    drawSurface() {
        //this.drawRightHalfFace();
        this.drawBend();
        //this.drawOutlines();
    }
}

// extrusion of a square with equal rounded corners
class simpleSurfaceDrawer {
    constructor(settings) {
        // TODO: insert guard clauses for settings

        this.sideLength = settings.boxTopW;
        this.height = settings.boxHeight;
        this.bendRadius = settings.topRadius;
        this.bendCircumference = (2 * Math.PI * this.bendRadius) / 4;
        this.slitsPerBend = Math.floor(settings.slitsPerRotation / 4);

        this.tailLength = settings.tailLength;
        this.tailWidth = settings.tailWidth;
        this.tailTaperRatio = settings.taperRatio;

        this.cutColor = settings.cutColor;
        this.engraveColor = settings.engraveDeepColor;

        this.xPosition = 0;
    }

    drawLockingJoint(amplitude, width, isRight) {
        let cutArray = [];
        let scoreArray = [];

        for (let y = 0; y < this.height; y += width) {
            // control1_x control1_y control2_x control2_y anchor_x anchor_y
            const halfWidth = width / 2;
            const sidewaysOffset = isRight ? 0 : -halfWidth / 2;

            cutArray.push(sidewaysOffset + amplitude + this.xPosition);
            cutArray.push(y);
            cutArray.push(sidewaysOffset + amplitude + this.xPosition);
            cutArray.push(y + halfWidth);
            cutArray.push(sidewaysOffset + 0 + this.xPosition);
            cutArray.push(y + halfWidth);
            cutArray.push(sidewaysOffset + 0 + this.xPosition);
            cutArray.push(y + width);
            cutArray.push(sidewaysOffset + amplitude + this.xPosition);
            cutArray.push(y + width);

            scoreArray.push(amplitude + this.xPosition);
            scoreArray.push(y);
            scoreArray.push(amplitude + this.xPosition);
            scoreArray.push(y + halfWidth);
            scoreArray.push(-amplitude + this.xPosition);
            scoreArray.push(y + halfWidth);
            scoreArray.push(-amplitude + this.xPosition);
            scoreArray.push(y + width);
            scoreArray.push(amplitude + this.xPosition);
            scoreArray.push(y + width);

            // bezierArray.push("C");
            // bezierArray.push(-1);
            // bezierArray.push(y + taperRatio);
            // bezierArray.push(1);
            // bezierArray.push(y + 1 - taperRatio);
            // bezierArray.push(1);
            // bezierArray.push(y + 1);

            // bezierArray.push("C");
            // bezierArray.push(1);
            // bezierArray.push(y + 1 + taperRatio);
            // bezierArray.push(-1);
            // bezierArray.push(y + 2 - taperRatio);
            // bezierArray.push(-1);
            // bezierArray.push(y + 2);
        }

        let scoreLine = draw.polyline(scoreArray);
        scoreLine.fill("none");
        scoreLine.stroke({ color: this.engraveColor, width: 1 });

        let cutLine = draw.polyline(cutArray);
        cutLine.fill("none");
        cutLine.stroke({ color: this.cutColor, width: 1 });
    }

    drawBezierDovetailJoint(amplitude, width, taperRatio) {
        const taper = taperRatio * width;

        let bezierArray = [];
        bezierArray.push("M");
        bezierArray.push(-amplitude + this.xPosition);
        bezierArray.push(0);

        for (let y = 0; y < this.height; y += width) {
            // control1_x control1_y control2_x control2_y anchor_x anchor_y
            const halfWidth = width / 2;

            bezierArray.push("C");
            bezierArray.push(-amplitude + this.xPosition);
            bezierArray.push(y + taper);
            bezierArray.push(amplitude + this.xPosition);
            bezierArray.push(y + halfWidth - taper);
            bezierArray.push(amplitude + this.xPosition);
            bezierArray.push(y + halfWidth);

            bezierArray.push("C");
            bezierArray.push(amplitude + this.xPosition);
            bezierArray.push(y + halfWidth + taper);
            bezierArray.push(-amplitude + this.xPosition);
            bezierArray.push(y + width - taper);
            bezierArray.push(-amplitude + this.xPosition);
            bezierArray.push(y + width);

            // bezierArray.push("C");
            // bezierArray.push(-1);
            // bezierArray.push(y + taperRatio);
            // bezierArray.push(1);
            // bezierArray.push(y + 1 - taperRatio);
            // bezierArray.push(1);
            // bezierArray.push(y + 1);

            // bezierArray.push("C");
            // bezierArray.push(1);
            // bezierArray.push(y + 1 + taperRatio);
            // bezierArray.push(-1);
            // bezierArray.push(y + 2 - taperRatio);
            // bezierArray.push(-1);
            // bezierArray.push(y + 2);
        }

        let bezierString = "";
        bezierArray.forEach(
            (e) => (bezierString = bezierString.concat(" ", e))
        );
        let bezier = draw.path(bezierString);
        bezier.fill("none");
        bezier.stroke({ color: this.cutColor, width: 1 });
        // bezier.transform({
        //     translateX: this.xPosition,
        //     translateY: this.height/2 - 10,
        //     scaleX: amplitude,
        //     scaleY: 20
        // })
    }

    drawBend() {
        const step = this.slitsPerBend - 1;
        for (let i = 0; i < this.slitsPerBend; i++) {
            const slitPosition =
                (i * this.bendCircumference) / (this.slitsPerBend - 1);
            draw.line(slitPosition, 0, slitPosition, this.height)
                .stroke({ color: this.engraveColor, width: 1 })
                .transform({ translateX: this.xPosition });
        }

        this.xPosition += this.bendCircumference;
    }

    drawLeftHalfFace() {
        this.xPosition += this.sideLength / 2 - this.bendRadius;

        // seems a bit hacky, but arcs are not supported by svg.js outside of paths

        // for (let y = 0; y < this.height; y += 35) {
        //     let arcString = "";
        //     const test = ["M", 5 + this.xPosition, 9 + y, "A", 10, 10, 0, 1, 1, 5 + this.xPosition, -9 + y]; //  A rx ry x-axis-rotation large-arc-flag sweep-flag x y
        //     test.forEach((e) => (arcString = arcString.concat(" ", e)));
        //     console.log(arcString)
        //     let arc = draw.path(arcString);
        //     arc.fill("none")
        //     arc.stroke({ color: this.cutColor, width: 1 })
        // }

        // for (let y = 17.5; y < this.height; y += 35) {
        //     let arcString = "";
        //     const test = ["M", -5 + this.xPosition + 10, -9 + y, "A", 10, 10, 0, 1, 1, -5 + this.xPosition + 10, 9 + y]; //  A rx ry x-axis-rotation large-arc-flag sweep-flag x y
        //     test.forEach((e) => (arcString = arcString.concat(" ", e)));
        //     console.log(arcString)
        //     let arc = draw.path(arcString);
        //     arc.fill("none")
        //     arc.stroke({ color: this.cutColor, width: 1 })
        // }

        // this.drawBezierDovetailJoint(
        //     this.tailLength,
        //     this.tailWidth,
        //     this.tailTaperRatio
        // );

        this.drawLockingJoint(this.tailLength, this.tailWidth, true);
    }

    drawRightHalfFace() {
        this.xPosition += this.tailLength;
        // this.drawBezierDovetailJoint(
        //     this.tailLength,
        //     this.tailWidth,
        //     this.tailTaperRatio
        // );

        this.drawLockingJoint(this.tailLength, this.tailWidth, false);

        this.xPosition += this.sideLength / 2 - this.bendRadius;
    }

    drawFullFace() {
        this.xPosition += this.sideLength - 2 * this.bendRadius;
    }

    drawOutlines() {
        // draw.rect(4 * (this.bendCircumference + this.sideLength - 2 * this.bendRadius) + this.tailLength, this.height)
        //     .fill("none")
        //     .stroke({ color: this.cutColor, width: 1 });
        draw.line(
            0,
            0,
            4 *
                (this.bendCircumference +
                    this.sideLength -
                    2 * this.bendRadius) +
                2 * this.tailLength,
            0
        ).stroke({ color: this.cutColor, width: 1 });
        draw.line(
            0,
            this.height,
            4 *
                (this.bendCircumference +
                    this.sideLength -
                    2 * this.bendRadius) +
                2 * this.tailLength,
            this.height
        ).stroke({ color: this.cutColor, width: 1 });
    }

    drawSurface() {
        this.drawRightHalfFace();
        this.drawBend();
        this.drawFullFace();
        this.drawBend();
        this.drawFullFace();
        this.drawBend();
        this.drawFullFace();
        this.drawBend();
        this.drawLeftHalfFace();
        this.drawOutlines();
    }
}

// https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
function saveSvg(svgEl, name) {
    svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var svgData = svgEl.outerHTML;
    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], {
        type: "image/svg+xml;charset=utf-8",
    });
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

let draw = SVG().addTo("#svg").size(1000, 1000);

let settings = {
    // lasercutter
    cutColor: "#FF0000",
    engraveDeepColor: "#0000FF",
    engraveShallowColor: "#FF00FF",

    //
    shape: "prism",

    // dovetail joints
    tailLength: 10,
    tailWidth: 40,
    taperRatio: 0.8,

    // box
    boxTopW: 150,
    boxTopH: 10,
    boxBottomW: 10,
    boxBottomH: 10,
    boxHeight: 400,
    boxShiftX: 0,
    boxShiftY: 0,

    topRadius: 30,
    bottomRadius: 3,
    minBendRadius: 1,
    slitsPerRotation: 40,

    // buttons
    "apply settings": function () {
        draw.clear();

        switch (settings.shape) {
            case "prism":
                surfaceDrawer = new simpleSurfaceDrawer(settings);
                break;
            case "frustum":
                surfaceDrawer = new simpleFrustumDrawer(settings);
                break;
            default:
                surfaceDrawer = new simpleSurfaceDrawer(settings);
        }

        surfaceDrawer.drawSurface();
    },
    "download svg": function () {
        saveSvg(
            document.getElementById("svg").firstChild,
            "boxturtle_export.svg"
        );
    },
};

let surfaceDrawer = new simpleSurfaceDrawer(settings);
surfaceDrawer.drawSurface();

function makeGUI() {
    let gui = new dat.GUI();

    let cutSettingsFolder = gui.addFolder("Laser Cutter Settings");
    cutSettingsFolder.addColor(settings, "cutColor");
    cutSettingsFolder.addColor(settings, "engraveDeepColor");
    cutSettingsFolder.addColor(settings, "engraveShallowColor");
    cutSettingsFolder.open();

    gui.add(settings, "shape", { prism: "prism", frustum: "frustum" });

    let jointSettingsFolder = gui.addFolder("Dovetail Joint Settings");
    jointSettingsFolder.add(settings, "tailLength");
    jointSettingsFolder.add(settings, "tailWidth");
    jointSettingsFolder.add(settings, "taperRatio");
    jointSettingsFolder.open();

    let boxSettingsFolder = gui.addFolder("Box Settings");
    boxSettingsFolder.add(settings, "boxTopW");
    boxSettingsFolder.add(settings, "boxTopH");

    boxSettingsFolder.add(settings, "boxBottomW");
    boxSettingsFolder.add(settings, "boxBottomH");

    boxSettingsFolder.add(settings, "boxHeight");
    boxSettingsFolder.open();

    let bendSettingsFolder = gui.addFolder("Bend Settings");
    bendSettingsFolder.add(settings, "minBendRadius");
    bendSettingsFolder.add(settings, "slitsPerRotation");
    bendSettingsFolder.add(settings, "topRadius");
    bendSettingsFolder.add(settings, "bottomRadius");
    bendSettingsFolder.open();

    let buttonFolder = gui.addFolder("Buttons");
    buttonFolder.add(settings, "apply settings");
    buttonFolder.add(settings, "download svg");
    buttonFolder.open();

    gui.open();
}

makeGUI();

class shiftedSurfaceDrawer {
    constructor() {
        this.nextSegmentPosition = vec2.fromValues(100, 100);
        this.nextSegmentRotation = 0; // degrees
    }

    drawSurface() {
        // draw Face
        // element.transform({
        //     rotate: 125,
        //     translateX: 50,
        //     translateY: 100,
        //     scale: 3
        //   })
        // draw Bend
        // draw Face
        // draw Bend
        // draw Face
        // draw Bend
        // draw Face
        // draw Bend
    }

    drawTrapezium(topWidth, bottomWidth, height, bottomShift) {
        let vertices = [];

        vertices.push([topWidth, 0]); // top right
        vertices.push([0, 0]); // top left
        vertices.push([(topWidth - bottomWidth) / 2 + bottomShift, height]); // bottom left
        vertices.push([
            bottomWidth - (topWidth - bottomWidth) / 2 + bottomShift,
            height,
        ]); // bottom right

        let leftSegment = vec2.create();
        vec2.sub(
            leftSegment,
            vec2.fromValues((topWidth - bottomWidth) / 2 + bottomShift, height),
            vec2.fromValues(0, 0)
        );
        const leftSideAngle =
            (Math.acos(leftSegment[1] / vec2.length(leftSegment)) * 360) /
            Math.PI;

        let rightSegment = vec2.create();
        vec2.sub(
            rightSegment,
            vec2.fromValues(
                bottomWidth - (topWidth - bottomWidth) / 2 + bottomShift,
                height
            ),
            vec2.fromValues(topWidth, 0)
        );
        const rightSideAngle =
            (Math.acos(rightSegment[1] / vec2.length(rightSegment)) * 360) /
            Math.PI;

        const angleBetweenSides = leftSideAngle - rightSideAngle;

        let poly = draw
            .polygon("0,0 100,50 50,100")
            .fill("red")
            .stroke({ width: 1 });
        poly.plot(vertices);
        poly.transform({
            rotate: this.nextSegmentRotation + leftSideAngle,
            translateX: this.nextSegmentPosition[0],
            translateY: this.nextSegmentPosition[1],
            scale: 1,
        });

        vec2.add(
            this.nextSegmentPosition,
            this.nextSegmentPosition,
            vec2.fromValues(topWidth, 0)
        );
        this.nextSegmentRotation += angleBetweenSides;
    }

    drawNextSegmentTransform() {
        let ellipse = draw.ellipse(10, 10).fill("green");
        ellipse.transform({
            rotate: this.nextSegmentRotation,
            translateX: this.nextSegmentPosition[0],
            translateY: this.nextSegmentPosition[1],
            scale: 1,
        });

        let arrow = draw
            .line(
                this.nextSegmentPosition[0],
                this.nextSegmentPosition[1],
                this.nextSegmentPosition[0] +
                    100 * Math.cos(this.nextSegmentRotation),
                this.nextSegmentPosition[1] +
                    100 * Math.sin(this.nextSegmentRotation)
            )
            .stroke({ color: "blue", width: 5 });
    }
}
