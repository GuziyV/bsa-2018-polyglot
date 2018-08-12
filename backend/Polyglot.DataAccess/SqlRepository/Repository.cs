﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Polyglot.DataAccess.Interfaces;

namespace Polyglot.DataAccess.SqlRepository
{
	public class Repository<TEntity> :  IRepository<TEntity> where TEntity : class
	{
		protected DbContext context;
		protected DbSet<TEntity> DbSet;

        private List<Expression<Func<TEntity, object>>> includeExpressions;

		public Repository(DbContext c)
		{
			this.context = c;
			DbSet = context.Set<TEntity>();
            includeExpressions = new List<Expression<Func<TEntity, object>>>();
		}

		public async Task<TEntity> CreateAsync(TEntity entity)
		{
			return (await DbSet.AddAsync(entity)).Entity;			
		}

		public async Task<TEntity> DeleteAsync(int id)
		{
			TEntity temp = await DbSet.FindAsync(id);
			if(temp != null)
			{
				return DbSet.Remove(temp).Entity;				
			}
            return null;
		}

        public async Task<TEntity> GetAsync(int id)
        {
            return await DbSet.FindAsync(id);
        }

        public async Task<List<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return await DbSet.Where(predicate).ToListAsync();
          //  return await ApplyIncludes().Where(predicate).ToListAsync();
        }

        public async Task<List<TEntity>> GetAllAsync()
        {
            return await DbSet.ToListAsync();
          //  return await ApplyIncludes().ToListAsync();
        }

        public TEntity Update(TEntity entity)
		{
			return DbSet.Update(entity).Entity;			
		}

        //public Task<bool> AnyAsync(Expression<Func<TEntity, bool>> where) 
        //    => 
        //    ApplyIncludes().AnyAsync(where);

        //public IRepository<TEntity> Include(Expression<Func<TEntity, object>> include)
        //{
        //    includeExpressions.Add(include);
        //    return this;
        //}

        //protected IQueryable<TEntity> ApplyIncludes()
        //    => 
        //    includeExpressions
        //        .Aggregate<Expression<Func<TEntity, object>>, IQueryable<TEntity>>(DbSet, (current, expression) => current.Include(expression));

    }
}