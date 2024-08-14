import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { isNullOrUndefined } from 'src/app/util/functions';

import { HTMLInterventionElement, InterventionService } from '../intervention.service';

@Component({
  selector: 'esm-canvas',
  templateUrl: './canvas.component.html',
})
export class CanvasComponent implements OnInit, AfterViewInit {
  canvas: HTMLCanvasElement;

  @ViewChild('canvas') canvasRef: ElementRef;

  constructor(private interventionService: InterventionService) {}

  ngOnInit(): void {
    this.interventionService.redrawGraph$.subscribe((_) => this.drawAllArrows());
  }

  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;
    this.resizeCanvas();
  }

  resizeCanvas() {
    let tiledBackground = document.getElementsByClassName('tiled-background')[0];
    let newHeight = tiledBackground.scrollHeight - 7;
    let newWidth = tiledBackground.scrollWidth;

    if (this.canvasRef.nativeElement.width !== newWidth) {
      this.canvasRef.nativeElement.width = newWidth;
    }

    if (this.canvasRef.nativeElement.height !== newHeight) {
      this.canvasRef.nativeElement.height = newHeight;
    }

    this.clearCanvas();
  }

  clearCanvas() {
    const ctx = this.canvas.getContext('2d');
    ctx.beginPath();
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.stroke();
  }

  drawAllArrows() {
    this.resizeCanvas();
    // // An array to keep control of which interventions had its arrows drew
    const already_drew: boolean[] = new Array<boolean>(this.interventionService.graphElements.length);
    // // Here we make a BFS
    const queue: { intervention: number; order_position: number }[] = [];

    queue.push({ intervention: this.interventionService.firstIntervention, order_position: 0 });

    while (queue.length > 0) {
      const { intervention, order_position } = queue[0];
      queue.splice(0, 1);
      if (isNullOrUndefined(intervention) || intervention === -1) {
        continue;
      }
      // Cycle on the BFS
      if (already_drew[intervention]) {
        this.interventionService.warnCycle(order_position);
        continue;
      }
      this.interventionService.graphElement(intervention).order_position = order_position;
      already_drew[intervention] = true;
      for (const destination of this.interventionService.interventionElementsGraph[intervention]) {
        queue.push({ intervention: destination, order_position: order_position + 1 });
        // console.log(intervention + '->' + destination);
        this.drawArrow(this.interventionService.graphElement(intervention), this.interventionService.graphElement(destination), true);
      }
      this.interventionService.lastInteractedIntervention = intervention;
    }
    this.interventionService.hasMultiplePaths = false;
    let ascii: number = 'a'.charCodeAt(0);

    // Draws the remaining interventions which are not linked with the first one (skips index 1 since it is invalid)
    for (let i = 0; i < already_drew.length; i++)
      if (!already_drew[i]) {
        this.interventionService.hasMultiplePaths = true;
        // Sets order_position to a ascii number (negative means it is a character)
        this.interventionService.graphElement(i).order_position = ascii * -1;
        for (const destination of this.interventionService.interventionElementsGraph[i])
          this.drawArrow(this.interventionService.graphElement(i), this.interventionService.graphElement(destination), false);
        ascii++;
      }
  }

  drawArrow(origin: HTMLInterventionElement, destination: HTMLInterventionElement, main: boolean = true) {
    if (!origin || !destination) return;

    const x_difference = destination.x - origin.x,
      y_difference = destination.y - origin.y;

    let arrow_origin: { x: number; y: number }, arrow_destination: { x: number; y: number };
    if (Math.abs(x_difference) > Math.abs(y_difference)) {
      arrow_origin = x_difference >= 0 ? origin.right : origin.left;
      arrow_destination = x_difference >= 0 ? destination.left : destination.right;
    } else if (Math.abs(x_difference) < Math.abs(y_difference)) {
      arrow_origin = y_difference >= 0 ? origin.bottom : origin.top;
      arrow_destination = y_difference >= 0 ? destination.top : destination.bottom;
    } else return;

    const ctx = this.canvas.getContext('2d');

    const sizeHead = 10;
    const angle = Math.atan2(y_difference, x_difference);
    ctx.beginPath();
    if (main) {
      ctx.strokeStyle = '#0a467f';
      ctx.lineWidth = 2;
    } else {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
    }
    ctx.moveTo(arrow_origin.x, arrow_origin.y);
    ctx.lineTo(arrow_destination.x, arrow_destination.y);
    ctx.lineTo(
      arrow_destination.x - sizeHead * Math.cos(angle - Math.PI / 6),
      arrow_destination.y - sizeHead * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(arrow_destination.x, arrow_destination.y);
    ctx.lineTo(
      arrow_destination.x - sizeHead * Math.cos(angle + Math.PI / 6),
      arrow_destination.y - sizeHead * Math.sin(angle + Math.PI / 6)
    );

    ctx.stroke();
  }
}
