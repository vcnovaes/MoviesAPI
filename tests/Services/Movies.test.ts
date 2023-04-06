import { MoviesService } from '../../src/Movies/MoviesService';
import { DatabaseClient } from '../../src/Database/DatabaseClient';
import { Movie } from '../../src/types/movies.type';
import { DatabaseInternalError } from '../../src/Database/Exceptions';

describe('MoviesService', () => {
    let moviesService: MoviesService;
    let databaseClientMock: any;

    beforeEach(() => {
        databaseClientMock = {
            all: jest.fn()
        };
        moviesService = new MoviesService();
        moviesService.dbClient = databaseClientMock;
    });

    describe('getMovies', () => {
        it('should retrieve all movies when no searchTerm is provided', async () => {
            // Arrange
            const expectedMovies: Movie[] = [{ id: 1, name: 'movie1', description: 'description1', rating: 3 }];
            databaseClientMock.all.mockImplementation((query: string, params: any[], callback: any) => {
                expect(query).toBe('SELECT id, name, description, rating FROM movie WHERE secret=(?) OR secret=0 LIMIT (?) OFFSET (?)');
                expect(params).toEqual([false, 10, 0]);
                callback(null, expectedMovies);
            });

            // Act
            const movies = await moviesService.getMovies();

            // Assert
            expect(databaseClientMock.all).toHaveBeenCalledTimes(1);
            expect(movies).toEqual(expectedMovies);
        });

        it('should retrieve movies with matching name or description when searchTerm is provided', async () => {
            // Arrange
            const expectedMovies: Movie[] = [{ id: 1, name: 'movie1', description: 'description1', rating: 3 }];
            databaseClientMock.all.mockImplementation((query: string, params: any[], callback: any) => {
                expect(query).toBe('SELECT id, name, description, rating FROM movie WHERE (secret=(?)  OR secret=0)  AND (name LIKE "%test%"  OR  description LIKE "%test%") LIMIT (?) OFFSET (?)');
                expect(params).toEqual([false, 10, 0]);
                callback(null, expectedMovies);
            });

            // Act
            const movies = await moviesService.getMovies(false, 0, 10, 'test');

            // Assert
            expect(databaseClientMock.all).toHaveBeenCalledTimes(1);
            expect(movies).toEqual(expectedMovies);
        });

        it('should reject with DatabaseInternalError when an error occurs', async () => {
            // Arrange
            const expectedError = new DatabaseInternalError("Not possible to get data about movies");
            databaseClientMock.all.mockImplementation((query: string, params: any[], callback: any) => {
                expect(query).toBe('SELECT id, name, description, rating FROM movie WHERE secret=(?) OR secret=0 LIMIT (?) OFFSET (?)');
                expect(params).toEqual([false, 10, 0]);
                callback(expectedError, null);
            });

            // Act
            try {
                await moviesService.getMovies();
            } catch (error) {
                // Assert
                expect(databaseClientMock.all).toHaveBeenCalledTimes(1);
                expect(error).toEqual(expectedError);
            }
        });
    });

    // Tests for getRestrictMovies method
});