using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;

namespace BackEnd.Domain.Shared
{
    public abstract class Enumeration : IComparable
    {
        public string Name { get; private set; }

        public int Id { get; private set; }

        protected Enumeration(int id, string name) => (Id, Name) = (id, name);

        public override string ToString() => Name;

        public static IEnumerable<T> GetAll<T>() where T : Enumeration =>
            typeof(T).GetFields(BindingFlags.Public |
                                BindingFlags.Static |
                                BindingFlags.DeclaredOnly)
                    .Select(f => f.GetValue(null))
                    .Cast<T>();

        public static List<string> GetAllString<T>() where T : Enumeration
        {
            IEnumerable<T> list = GetAll<T>();
            List<string> listString = [];
            foreach (T value in list)
            {
                listString.Add(value.Name);
            }
            return listString;
        }

        public override bool Equals(object obj)
        {
            if (obj is not Enumeration otherValue)
            {
                return false;
            }

            var typeMatches = GetType().Equals(obj.GetType());
            var valueMatches = Id.Equals(otherValue.Id);

            return typeMatches && valueMatches;
        }

        public int CompareTo(object other) => Id.CompareTo(((Enumeration)other).Id);

        public override int GetHashCode()
        {
            return Id.GetHashCode();
        }

        public static T Parse<T>(string valueToParse) where T : Enumeration
        {
            valueToParse = Regex.Replace(valueToParse.ToLower(), "[ _./]", "");

            IEnumerable<T> list = GetAll<T>();
            foreach (T value in list)
            {
                string valueFormatted = Regex.Replace(value.Name.ToLower(), "[ _./]", "");
                if (valueToParse.Equals(valueFormatted))
                    return value;
            }
            return default(T);
        }

        public static T Parse<T>(int valueToParse) where T : Enumeration
        {
            IEnumerable<T> list = GetAll<T>();
            foreach (T value in list)
            {
                if (value.Id == valueToParse)
                    return value;
            }
            return default(T);
        }
    }
}