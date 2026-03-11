import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CategoriaService } from '../../services/categoria.service';

@Component({
  selector: 'app-categorias-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias-page.component.html',
  styleUrls: ['./categorias-page.component.css']
})
export class CategoriasPageComponent implements OnInit {

  categorias: any[] = [];

  nuevaCategoria = {
    nombre_categoria: '',
    descripcion: ''
  };

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias() {
    this.categoriaService.getCategorias()
      .subscribe(data => {
        this.categorias = data;
      });
  }

  crearCategoria() {

    this.categoriaService.createCategoria(this.nuevaCategoria)
      .subscribe(() => {

        this.nuevaCategoria = {
          nombre_categoria: '',
          descripcion: ''
        };

        this.getCategorias();
      });

  }

  eliminarCategoria(id: number) {

    this.categoriaService.deleteCategoria(id)
      .subscribe(() => {
        this.getCategorias();
      });

  }

}
