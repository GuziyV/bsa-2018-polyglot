﻿using MongoDB.Bson;
using MongoDB.Driver;
using Polyglot.DataAccess.Interfaces;
using Polyglot.DataAccess.MongoModels;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Polyglot.DataAccess.MongoRepository
{
    public class MongoRepository<TEntity> : IRepository<TEntity>
        where TEntity : IEntity
    {
        string _collectionName;

        protected IMongoCollection<TEntity> Collection =>
            _dataContext.MongoDatabase.GetCollection<TEntity>(CollectionName);

        private readonly IMongoDataContext _dataContext;

        public string CollectionName
        {
            get => _collectionName ?? typeof(TEntity).Name;
            set => _collectionName = value;
        }

        public MongoRepository(IMongoDataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<TEntity> CreateAsync(TEntity item)
        {
            try
            {
                await Collection.InsertOneAsync(item);
                return item;
            }
            catch (Exception ex)
            {
                // log or manage the exception
                throw ex;
            }
        }

        public async Task<List<TEntity>> GetAllAsync()
        {
            try
            {
                return await (await Collection.FindAsync<TEntity>(new BsonDocument())).ToListAsync();
            }
            catch (Exception ex)
            {
                // log or manage the exception
                throw ex;
            }
        }
        public async Task<List<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>> filter)
        {
            try
            {
                return await (await Collection.FindAsync<TEntity>(filter)).ToListAsync();
            }
            catch (Exception ex)
            {
                // log or manage the exception
                throw ex;
            }
        }



        public async Task<TEntity> GetAsync(int id)
        {
            try
            {
                var cursor = await Collection
                                .Find(x => x.Id == id)
                                .FirstOrDefaultAsync();
                return (TEntity)cursor;
            }
            catch (Exception ex)
            {
                // log or manage the exception
                throw ex;
            }
        }

        public async Task<TEntity> DeleteAsync(int id)
        {
            try
            {
                DeleteResult actionResult
                    = await Collection.DeleteOneAsync(
                        Builders<TEntity>.Filter.Eq("Id", id));

                return null;
            }
            catch (Exception ex)
            {
                // log or manage the exception
                throw ex;
            }
        }

        public TEntity Update(TEntity entity)
        {
            try
            {
                var updateResult = Collection
                    .ReplaceOne<TEntity>(filter: g => g.Id == entity.Id, replacement: entity);
                return entity;
            }
            catch (Exception ex)
            {
                // log or manage the exception
                throw ex;
            }
        }

        public Task<bool> AnyAsync(Expression<Func<TEntity, bool>> where)
        {
            throw new NotImplementedException();
        }

        public IRepository<TEntity> Include(Expression<Func<TEntity, object>> include)
        {
            throw new NotImplementedException();
        }
    }
}