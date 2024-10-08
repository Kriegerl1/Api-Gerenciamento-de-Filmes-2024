import { Component, numberAttribute, OnInit } from '@angular/core';
import { FilmeService } from '../../services/listagem-de-filmes.service';
import { ListagemDeFilme } from '../../models/listagem-de-filmes';
import { formatDate, NgClass, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listagem-de-filmes',
  standalone: true,
  imports: [ListagemDeFilmesComponent, NgFor, NgClass, RouterLink],
  templateUrl: './listagem-de-filmes.component.html',
  styleUrl: './listagem-de-filmes.component.scss',
})
export class ListagemDeFilmesComponent implements OnInit {
  public filmes: ListagemDeFilme[];
  private pagina: number = 1;

  constructor(private filmeService: FilmeService) {
    this.filmes = [];
  }

  ngOnInit(): void {
    this.BuscarFilmesPopulares();
  }

  public BuscarFilmesPopulares() {
    this.filmeService.selecionarFilmesPopulares(this.pagina).subscribe((f) => {
      const resultado = f.results as any[];

      const filmeMapeados = resultado.map(this.mapearListagemDeFilmes);

      //spread syntax
      this.filmes.push(...filmeMapeados);
      console.log(filmeMapeados);

      this.pagina++;
    });
  }

  private mapearListagemDeFilmes(obj: any): ListagemDeFilme {
    return {
      id: obj.id,
      titulo: obj.title,
      lancamento: formatDate(obj.release_date, 'mediumDate', 'pt-BR'),
      imagem: 'https://image.tmdb.org/t/p/w300/' + obj.poster_path,
      notaEmPorcentagem: (obj.vote_average * 10).toFixed(1),
    };
  }

  public mapearCorDaNota(avaliacaoString: string): string {
    const avaliacao = Number(avaliacaoString);

    if (avaliacao > 0 && avaliacao <= 30) return 'app-borda-nota-mais-baixa';
    else if (avaliacao > 30 && avaliacao <= 50) return 'app-borda-nota-baixa';
    else if (avaliacao > 50 && avaliacao <= 75) return 'app-borda-nota-media';
    else return 'app-borda-nota-alta';
  }
}
