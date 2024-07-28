using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Dtos.Stock;
using api.Helpers;
using api.Interfaces;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repository
{
    public class StockRepository : IStockRepository
    {
        private readonly ApplicationDBContext _context;
        public StockRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Stock> CreateAsync(Stock stockModel)
        {
            await _context.Stocks.AddAsync(stockModel);
            await _context.SaveChangesAsync();
            return stockModel;
        }

        public async Task<Stock?> DeleteAsync(int id)
        {
            var stockModel = await _context.Stocks.FirstOrDefaultAsync(s => s.Id == id);

            if (stockModel == null)
            {
                return null;
            }

            _context.Stocks.Remove(stockModel);
            await _context.SaveChangesAsync();

            return stockModel;
        }

        public async Task<List<Stock>> GetAllAsync(QueryObject query)
        {
            //return await _context.Stocks.Include(s => s.Comments).ToListAsync();
            var basicQuery = _context.Stocks.Include(s => s.Comments).ThenInclude(c => c.AppUser).AsQueryable();
            if (!string.IsNullOrWhiteSpace(query.Symbol))
            {
                basicQuery = basicQuery.Where(s => s.Symbol.Contains(query.Symbol));
            }
            if (!string.IsNullOrWhiteSpace(query.CompanyName))
            {
                basicQuery = basicQuery.Where(s => s.CompanyName.Contains(query.CompanyName));
            }
            if (!string.IsNullOrWhiteSpace(query.SortBy))
            {
                // it's interesting if we can use that to implement a generic sort by...
                // var properyToSortBy = typeof(Stock).GetProperties().FirstOrDefault(p => p.Name.Equals(query.sortBy));
                // if (properyToSortBy != null)
                // {
                //     Console.WriteLine("The Property:", properyToSortBy.Name);
                //     var basicQuery2 = _context.Stocks.Include(s => s.Comments).AsQueryable().
                //     OrderBy(s => properyToSortBy.Name).ToList();
                //     var x = 1;
                // }

                if (query.SortBy.Equals("Symbol", StringComparison.OrdinalIgnoreCase))
                {
                    basicQuery = query.IsDesc ?
                    basicQuery.OrderByDescending(s => s.Symbol) :
                    basicQuery.OrderBy(s => s.Symbol);
                }

            }

            var stocksToReturn = await basicQuery
            .Skip((query.PageNumber - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync();

            return stocksToReturn;
        }

        public async Task<Stock?> GetByIdAsync(int id)
        {
            return await _context.Stocks.Include(s => s.Comments).FirstOrDefaultAsync(s => s.Id == id);

            // if (stockModel == null)
            // {
            //     return null;
            // }

            // return stockModel;

        }


        public async Task<Stock?> UpdateAsync(int id, UpdateStockRequestDto stockDto)
        {
            var existingStock = await _context.Stocks.FirstOrDefaultAsync(s => s.Id == id);

            if (existingStock == null)
            {
                return null;
            }

            existingStock.Symbol = stockDto.Symbol;
            existingStock.CompanyName = stockDto.CompanyName;
            existingStock.Purchase = stockDto.Purchase;
            existingStock.LastDiv = stockDto.LastDiv;
            existingStock.Industry = stockDto.Industry;
            existingStock.MarketCap = stockDto.MarketCap;

            await _context.SaveChangesAsync();

            return existingStock;


        }


        public async Task<bool> StockExists(int id)
        {
            return await _context.Stocks.AnyAsync(s => s.Id == id);
        }

        public async Task<Stock?> GetBySymbolAsync(string symbol)
        {
            return await _context.Stocks.FirstOrDefaultAsync(s => s.Symbol == symbol);

        }
    }
}